// 전체 드라이버·전체 유효 랩을 취합한 min/max로 SVG 좌표계(VIEW=1000, PAD=40)를 통일한다.
// trackSpeed.ts의 normalizeTraces와 동일한 스케일 공식 — 대상 집합만 2드라이버에서 N드라이버로 확장.

import type { TrackPoint, TrackSpeedBounds } from './trackSpeed'
import type { DriverTraceAccumulator, RawPointWithD } from './cornerAnalysisDriverTrace'

const VIEW = 1000
const PAD = 40

export interface ReferenceLapKey {
  driverNumber: number
  lapNumber: number
}

// 모든 드라이버의 유효 랩 중 lap_duration 최소인 랩 하나를 기준 랩으로 선정
export function pickReferenceLap(accumulators: DriverTraceAccumulator[]): ReferenceLapKey | null {
  let best: (ReferenceLapKey & { lapDuration: number }) | null = null
  for (const acc of accumulators) {
    for (const lap of acc.validLaps) {
      if (best === null || lap.lapDuration < best.lapDuration) {
        best = { driverNumber: acc.driverNumber, lapNumber: lap.lapNumber, lapDuration: lap.lapDuration }
      }
    }
  }
  return best ? { driverNumber: best.driverNumber, lapNumber: best.lapNumber } : null
}

interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
  speedMin: number
  speedMax: number
}

function computeBounds(accumulators: DriverTraceAccumulator[]): Bounds {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity
  let speedMin = Infinity, speedMax = -Infinity
  for (const acc of accumulators) {
    for (const lap of acc.validLaps) {
      for (const p of lap.points) {
        if (p.x < minX) minX = p.x
        if (p.x > maxX) maxX = p.x
        if (p.y < minY) minY = p.y
        if (p.y > maxY) maxY = p.y
        if (p.speed < speedMin) speedMin = p.speed
        if (p.speed > speedMax) speedMax = p.speed
      }
    }
  }
  return { minX, maxX, minY, maxY, speedMin, speedMax }
}

function toTrackPoint(p: RawPointWithD, minX: number, minY: number, scale: number): TrackPoint {
  return {
    x: Math.round(PAD + (p.x - minX) * scale),
    y: Math.round(VIEW - PAD - (p.y - minY) * scale), // OpenF1 up=positive, SVG down=positive
    speed: p.speed,
    throttle: p.throttle,
    brake: p.brake,
    gear: p.gear,
    d: p.d,
  }
}

export interface NormalizedResult {
  validLapsByDriver: Map<number, TrackPoint[][]>
  refLapTrackPoints: TrackPoint[]
  trackPath: { x: number; y: number }[]
  bounds: TrackSpeedBounds
}

export function normalizeAll(
  accumulators: DriverTraceAccumulator[],
  refKey: ReferenceLapKey,
): NormalizedResult {
  const { minX, maxX, minY, maxY, speedMin, speedMax } = computeBounds(accumulators)
  const scale = (VIEW - 2 * PAD) / Math.max(maxX - minX, maxY - minY, 1)

  const validLapsByDriver = new Map<number, TrackPoint[][]>()
  let refLapTrackPoints: TrackPoint[] = []

  for (const acc of accumulators) {
    const laps = acc.validLaps.map((lap) => {
      const points = lap.points.map((p) => toTrackPoint(p, minX, minY, scale))
      if (acc.driverNumber === refKey.driverNumber && lap.lapNumber === refKey.lapNumber) {
        refLapTrackPoints = points
      }
      return points
    })
    validLapsByDriver.set(acc.driverNumber, laps)
  }

  return {
    validLapsByDriver,
    refLapTrackPoints,
    trackPath: refLapTrackPoints.map((p) => ({ x: p.x, y: p.y })),
    bounds: {
      viewBox: VIEW,
      speedMin: Math.floor(speedMin),
      speedMax: Math.ceil(speedMax),
    },
  }
}
