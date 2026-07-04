// 드라이버별 순차 fetch(laps/location/car_data) → 유효 랩 판정 → 랩 단위 슬라이스 + lap-local d 계산.
// 좌표(x,y)는 아직 SVG로 정규화하지 않은 원본 값 — 전체 세션 취합 후 cornerAnalysisNormalize에서 일괄 처리.

import { joinByNearestTime, type RawPoint, type OpenF1Driver } from './openf1'
import { buildValidLapNumbers, type LapWindow } from './validLaps'
import type { SafetyCarPeriod } from './safetyCar'
import {
  fetchDriverLaps,
  fetchDriverLocation,
  fetchDriverCarData,
  type DriverResultInfo,
  type DriverStintInfo,
} from './openf1CornerFetch'

export interface RawPointWithD extends RawPoint {
  d: number // lap-local cumulative distance ratio(0..1), 원본 좌표 기준
}

export interface DriverValidLap {
  lapNumber: number
  lapDuration: number
  points: RawPointWithD[]
}

export interface DriverTraceAccumulator {
  driverNumber: number
  teamName: string
  teamColour: string
  code: string
  validLaps: DriverValidLap[]
}

type RaceStatus = 'DNF' | 'DNS' | 'DSQ' | null

function determineRaceStatus(result: DriverResultInfo | undefined): RaceStatus {
  if (!result) return null
  if (result.dsq) return 'DSQ'
  if (result.dns) return 'DNS'
  if (result.dnf) return 'DNF'
  return null
}

// 랩마다 처음부터 다시 계산하는 누적거리비율(0..1) — 랩 간 독립적
function computeLapLocalD(points: RawPoint[]): RawPointWithD[] {
  const cum: number[] = [0]
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x
    const dy = points[i].y - points[i - 1].y
    cum.push(cum[i - 1] + Math.sqrt(dx * dx + dy * dy))
  }
  const total = cum[cum.length - 1] || 1
  return points.map((p, i) => ({ ...p, d: cum[i] / total }))
}

// rawPoints/ms는 시간순으로 1:1 대응(loc을 시간순 정렬 후 joinByNearestTime에 전달했기 때문).
// 랩 구간은 서로 겹치지 않고 시간순이므로 포인터를 한 번만 전진시키는 투 포인터로 슬라이스한다.
function sliceLapsByTime(points: RawPoint[], ms: number[], windows: LapWindow[]): Map<number, RawPoint[]> {
  const sorted = [...windows].sort((a, b) => a.startMs - b.startMs)
  const result = new Map<number, RawPoint[]>()
  let pointer = 0
  for (const w of sorted) {
    while (pointer < ms.length && ms[pointer] < w.startMs) pointer++
    const startIdx = pointer
    let endIdx = startIdx
    while (endIdx < ms.length && ms[endIdx] <= w.endMs) endIdx++
    result.set(w.lapNumber, points.slice(startIdx, endIdx))
    pointer = endIdx
  }
  return result
}

function buildLapWindows(
  laps: { lap_number: number; lap_duration: number | null; date_start: string | null }[],
  validLapNumbers: Set<number>,
): LapWindow[] {
  return laps
    .filter((l) => validLapNumbers.has(l.lap_number) && l.date_start != null && l.lap_duration != null)
    .map((l) => {
      const startMs = new Date(l.date_start as string).getTime()
      return { lapNumber: l.lap_number, startMs, endMs: startMs + (l.lap_duration as number) * 1000 }
    })
}

function normalizeTeamColour(raw: string): string {
  return raw.startsWith('#') ? raw : `#${raw}`
}

export async function buildDriverTrace(
  sessionKey: number,
  driver: OpenF1Driver,
  resultMap: Map<number, DriverResultInfo>,
  stintsByDriver: Map<number, DriverStintInfo>,
  scPeriods: readonly SafetyCarPeriod[],
): Promise<DriverTraceAccumulator | null> {
  const driverNumber = driver.driver_number

  const laps = await fetchDriverLaps(sessionKey, driverNumber)
  const loc = await fetchDriverLocation(sessionKey, driverNumber)
  const car = await fetchDriverCarData(sessionKey, driverNumber)
  if (loc.length === 0 || car.length === 0) return null

  const locSorted = [...loc].sort((a, b) => a.date.localeCompare(b.date))
  const locMs = locSorted.map((p) => new Date(p.date).getTime())
  const rawPoints = joinByNearestTime(locSorted, car)

  const result = resultMap.get(driverNumber)
  const raceStatus = determineRaceStatus(result)
  const { pitOutLapNumbers, pitInLapNumbers } = stintsByDriver.get(driverNumber) ?? {
    pitOutLapNumbers: new Set<number>(),
    pitInLapNumbers: new Set<number>(),
  }

  const validLapNumbers = buildValidLapNumbers({
    laps,
    pitOutLapNumbers,
    pitInLapNumbers,
    raceStatus,
    lastCompletedLap: result?.numberOfLaps ?? Number.MAX_SAFE_INTEGER,
    scPeriods,
  })
  if (validLapNumbers.size === 0) return null

  const lapWindows = buildLapWindows(laps, validLapNumbers)
  const sliced = sliceLapsByTime(rawPoints, locMs, lapWindows)
  const lapDurationByNumber = new Map(laps.map((l) => [l.lap_number, l.lap_duration]))

  const validLaps: DriverValidLap[] = []
  for (const w of lapWindows) {
    const points = sliced.get(w.lapNumber) ?? []
    const lapDuration = lapDurationByNumber.get(w.lapNumber)
    if (points.length < 2 || lapDuration == null) continue
    validLaps.push({ lapNumber: w.lapNumber, lapDuration, points: computeLapLocalD(points) })
  }
  if (validLaps.length === 0) return null

  return {
    driverNumber,
    teamName: driver.team_name,
    teamColour: normalizeTeamColour(driver.team_colour),
    code: driver.name_acronym,
    validLaps,
  }
}
