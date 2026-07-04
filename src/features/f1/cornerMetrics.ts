import { findClosestByD, type TrackPoint } from './trackSpeed'
import {
  CORNER_WINDOW_D,
  MIN_CORNER_SAMPLE,
  MIN_INSTANCE_SAMPLE,
  OUTLIER_SLOW_THRESHOLD,
  STRAIGHT_ACCEL_SPAN_D,
  type CornerDef,
  type StraightDef,
  type TeamCarProfile,
  type TeamCornerMetric,
  type TeamStraightMetric,
} from './cornerAnalysis'

// ─── Circular distance helper ─────────────────────────────────────────────────
// d는 0..1 순환값이므로 코너/직선이 시작/종료선 근처에 있어도 올바르게 판정되도록 순환 거리로 비교한다

function circularDistanceD(a: number, b: number): number {
  const diff = Math.abs(a - b)
  return Math.min(diff, 1 - diff)
}

function wrapD(d: number): number {
  return ((d % 1) + 1) % 1
}

// ─── Per-lap instance metrics ─────────────────────────────────────────────────

export function cornerInstanceApex(lapPoints: TrackPoint[], corner: CornerDef): number {
  const inWindow = lapPoints.filter(
    (p) => circularDistanceD(p.d, corner.apexD) <= CORNER_WINDOW_D,
  )
  if (inWindow.length === 0) return NaN
  return Math.min(...inWindow.map((p) => p.speed))
}

function pointsInStraight(lapPoints: TrackPoint[], straight: StraightDef): TrackPoint[] {
  const { startD, endD } = straight
  if (startD <= endD) {
    return lapPoints.filter((p) => p.d >= startD && p.d <= endD)
  }
  // wrap: 구간이 1.0을 넘어 0으로 돌아감
  return lapPoints.filter((p) => p.d >= startD || p.d <= endD)
}

export function straightInstanceMetrics(
  lapPoints: TrackPoint[],
  straight: StraightDef,
): { topSpeed: number; accelRate: number } | null {
  const inStraight = pointsInStraight(lapPoints, straight)
  if (inStraight.length < 2) return null

  const topSpeed = Math.max(...inStraight.map((p) => p.speed))

  const s0 = findClosestByD(lapPoints, straight.startD)
  const s1 = findClosestByD(lapPoints, wrapD(straight.startD + STRAIGHT_ACCEL_SPAN_D))
  const accelRate = (s1.speed - s0.speed) / STRAIGHT_ACCEL_SPAN_D

  return { topSpeed, accelRate }
}

// ─── Scalarization ─────────────────────────────────────────────────────────────

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

// 인스턴스 샘플이 충분치 않으면 null. 아니면 median 대비 지나치게 느린 이상치를 제거하고 재계산
export function driverCornerScalar(instances: number[]): { value: number | null; kept: number } {
  if (instances.length < MIN_INSTANCE_SAMPLE) return { value: null, kept: 0 }

  const initialMedian = median(instances)
  const kept = instances.filter((v) => v >= initialMedian * (1 - OUTLIER_SLOW_THRESHOLD))

  return { value: median(kept), kept: kept.length }
}

// ─── Team aggregation ───────────────────────────────────────────────────────────

export interface AggregateTeamParams {
  teamName: string
  teamColour: string
  driverNumbers: number[]
  validLapsByDriver: Map<number, TrackPoint[][]>
  corners: CornerDef[]
  straights: StraightDef[]
  totalLaps: number
}

// 드라이버별 스칼라값 목록에서 driverCount/soloDriverCode/평균값을 파생시키는 공통 로직.
// soloDriverCode는 드라이버 코드(3글자)가 아직 이 레이어에 전달되지 않아 번호 문자열로 대체한다.
function combineDriverScalars(
  perDriver: { driverNumber: number; value: number | null }[],
): { median: number | null; driverCount: number; soloDriverCode?: string } {
  const contributed = perDriver.filter((d): d is { driverNumber: number; value: number } => d.value != null)

  if (contributed.length === 0) return { median: null, driverCount: 0 }

  const avg = contributed.reduce((sum, d) => sum + d.value, 0) / contributed.length
  if (contributed.length === 1) {
    return { median: avg, driverCount: 1, soloDriverCode: String(contributed[0].driverNumber) }
  }
  return { median: avg, driverCount: contributed.length }
}

function buildCornerMetric(
  corner: CornerDef,
  driverNumbers: number[],
  validLapsByDriver: Map<number, TrackPoint[][]>,
): TeamCornerMetric {
  const perDriver = driverNumbers.map((driverNumber) => {
    const laps = validLapsByDriver.get(driverNumber) ?? []
    const instances = laps
      .map((lapPoints) => cornerInstanceApex(lapPoints, corner))
      .filter((v) => !Number.isNaN(v))
    return { driverNumber, value: driverCornerScalar(instances).value }
  })

  const combined = combineDriverScalars(perDriver)
  return {
    cornerIndex: corner.index,
    apexSpeedMedian: combined.median,
    driverCount: combined.driverCount,
    soloDriverCode: combined.soloDriverCode,
  }
}

function buildStraightMetric(
  straight: StraightDef,
  driverNumbers: number[],
  validLapsByDriver: Map<number, TrackPoint[][]>,
): TeamStraightMetric {
  const perDriverInstances = driverNumbers.map((driverNumber) => {
    const laps = validLapsByDriver.get(driverNumber) ?? []
    const instances = laps
      .map((lapPoints) => straightInstanceMetrics(lapPoints, straight))
      .filter((m): m is { topSpeed: number; accelRate: number } => m != null)
    return { driverNumber, instances }
  })

  const perDriverTop = perDriverInstances.map(({ driverNumber, instances }) => ({
    driverNumber,
    value: driverCornerScalar(instances.map((m) => m.topSpeed)).value,
  }))
  const perDriverAccel = perDriverInstances.map(({ driverNumber, instances }) => ({
    driverNumber,
    value: driverCornerScalar(instances.map((m) => m.accelRate)).value,
  }))

  const topCombined = combineDriverScalars(perDriverTop)
  const accelCombined = combineDriverScalars(perDriverAccel)

  return {
    straightIndex: straight.index,
    topSpeedMedian: topCombined.median,
    accelRateMedian: accelCombined.median,
    driverCount: Math.max(topCombined.driverCount, accelCombined.driverCount),
    soloDriverCode: topCombined.soloDriverCode ?? accelCombined.soloDriverCode,
  }
}

function averageExcludingNull(values: (number | null)[]): number | null {
  const present = values.filter((v): v is number => v != null)
  if (present.length === 0) return null
  return present.reduce((sum, v) => sum + v, 0) / present.length
}

function insufficientLapsProfile(params: AggregateTeamParams): TeamCarProfile {
  return {
    teamName: params.teamName,
    teamColour: params.teamColour,
    driverNumbers: params.driverNumbers,
    meetsLapThreshold: false,
    aeroStatus: 'INSUFFICIENT_LAPS',
    mechanicalStatus: 'INSUFFICIENT_LAPS',
    aeroScore: null,
    mechanicalScore: null,
    straightScore: null,
    corners: [],
    straights: [],
    isSingleDriver: false,
  }
}

export function aggregateTeam(params: AggregateTeamParams): TeamCarProfile {
  const { teamName, teamColour, driverNumbers, validLapsByDriver, corners, straights, totalLaps } = params

  const totalValidLaps = driverNumbers.reduce(
    (sum, n) => sum + (validLapsByDriver.get(n)?.length ?? 0),
    0,
  )
  if (totalValidLaps < totalLaps) return insufficientLapsProfile(params)

  const cornerMetrics = corners.map((c) => buildCornerMetric(c, driverNumbers, validLapsByDriver))
  const straightMetrics = straights.map((s) => buildStraightMetric(s, driverNumbers, validLapsByDriver))

  const highCorners = corners.filter((c) => c.type === 'HIGH')
  const lowCorners = corners.filter((c) => c.type === 'LOW')

  const aeroStatus = highCorners.length < MIN_CORNER_SAMPLE ? 'INSUFFICIENT_SAMPLE' : 'OK'
  const mechanicalStatus = lowCorners.length < MIN_CORNER_SAMPLE ? 'INSUFFICIENT_SAMPLE' : 'OK'

  const aeroScore = averageExcludingNull(
    cornerMetrics.filter((m) => highCorners.some((c) => c.index === m.cornerIndex)).map((m) => m.apexSpeedMedian),
  )
  const mechanicalScore = averageExcludingNull(
    cornerMetrics.filter((m) => lowCorners.some((c) => c.index === m.cornerIndex)).map((m) => m.apexSpeedMedian),
  )
  const straightScore = averageExcludingNull(straightMetrics.map((m) => m.topSpeedMedian))

  const isSingleDriver =
    cornerMetrics.some((m) => m.driverCount === 1) || straightMetrics.some((m) => m.driverCount === 1)

  return {
    teamName,
    teamColour,
    driverNumbers,
    meetsLapThreshold: true,
    aeroStatus,
    mechanicalStatus,
    aeroScore,
    mechanicalScore,
    straightScore,
    corners: cornerMetrics,
    straights: straightMetrics,
    isSingleDriver,
  }
}
