import type { SafetyCarPeriod } from './safetyCar'

export interface LapWindow {
  lapNumber: number
  startMs: number
  endMs: number
}

interface LapRecordInput {
  lap_number: number
  lap_duration: number | null
  date_start: string | null
  is_pit_out_lap: boolean
}

export interface BuildValidLapNumbersParams {
  laps: LapRecordInput[]
  pitOutLapNumbers: Set<number> // Stint.lapStart (stintNumber > 1인 것들)
  pitInLapNumbers: Set<number> // Stint.lapEnd (마지막 스틴트 제외)
  raceStatus: 'DNF' | 'DNS' | 'DSQ' | null
  lastCompletedLap: number // DNF/DSQ 시 리타이어 전 정상 주행 마지막 랩
  scPeriods: readonly SafetyCarPeriod[]
}

function overlapsSafetyCar(window: LapWindow, periods: readonly SafetyCarPeriod[]): boolean {
  // 랩 구간의 어느 한 지점이라도 SC/VSC 구간 내부면 겹침으로 판정.
  // isDuringSafetyCar는 단일 시각용이라 시작/끝 두 지점만으로는 놓치는 경우가 있어
  // 구간 자체가 겹치는지(window.startMs <= period.endMs && window.endMs >= period.startMs) 직접 검사한다.
  return periods.some((p) => window.startMs <= p.endMs && window.endMs >= p.startMs)
}

function isExcludedLap(
  lap: LapRecordInput,
  params: BuildValidLapNumbersParams,
): boolean {
  if (lap.lap_duration == null || lap.date_start == null) return true
  if (
    lap.is_pit_out_lap ||
    params.pitOutLapNumbers.has(lap.lap_number) ||
    params.pitInLapNumbers.has(lap.lap_number)
  ) {
    return true
  }
  if (
    (params.raceStatus === 'DNF' || params.raceStatus === 'DSQ') &&
    lap.lap_number > params.lastCompletedLap
  ) {
    return true
  }

  const startMs = new Date(lap.date_start).getTime()
  const endMs = startMs + lap.lap_duration * 1000
  return overlapsSafetyCar({ lapNumber: lap.lap_number, startMs, endMs }, params.scPeriods)
}

export function buildValidLapNumbers(params: BuildValidLapNumbersParams): Set<number> {
  if (params.raceStatus === 'DNS') return new Set()

  const valid = new Set<number>()
  for (const lap of params.laps) {
    if (!isExcludedLap(lap, params)) valid.add(lap.lap_number)
  }
  return valid
}
