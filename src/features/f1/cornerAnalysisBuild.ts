// F1 "팀별 코너 강점 분석" 오케스트레이션 — OpenF1 순차 fetch → 코너/직선 탐지 → 팀별 집계.
// 순수 로직(Phase A: cornerAnalysis.ts/cornerMetrics.ts/validLaps.ts/safetyCar.ts)은 그대로 소비만 한다.

import {
  ALGO_VERSION,
  detectCorners,
  detectStraights,
  type CornerDef,
  type StraightDef,
  type TeamCarProfile,
} from './cornerAnalysis'
import { aggregateTeam } from './cornerMetrics'
import { buildSafetyCarPeriods, type SafetyCarPeriod } from './safetyCar'
import type { OpenF1Driver } from './openf1'
import type { TrackSpeedBounds } from './trackSpeed'
import {
  fetchSessionMeta,
  fetchSessionDrivers,
  fetchSessionResultMap,
  fetchStintInfo,
  fetchRaceControlEvents,
  type DriverResultInfo,
  type DriverStintInfo,
} from './openf1CornerFetch'
import { buildDriverTrace, type DriverTraceAccumulator } from './cornerAnalysisDriverTrace'
import { pickReferenceLap, normalizeAll } from './cornerAnalysisNormalize'
import { buildTeamGroups, replaceSoloDriverCodes } from './cornerAnalysisTeams'

export interface CornerAnalysisData {
  sessionKey: number
  circuitShortName: string
  countryName: string
  totalLaps: number
  algoVersion: number
  bounds: TrackSpeedBounds
  trackPath: { x: number; y: number }[]
  corners: CornerDef[]
  straights: StraightDef[]
  teams: TeamCarProfile[]
}

export type CornerAnalysisResponse =
  | { success: true; data: CornerAnalysisData }
  | { success: false; error: string }

// 드라이버별 순차 처리 — 동시 실행 시 OpenF1 429 유발 (trackSpeed.ts/pit-strategy/route.ts와 동일 컨벤션)
async function collectDriverTraces(
  sessionKey: number,
  drivers: OpenF1Driver[],
  resultMap: Map<number, DriverResultInfo>,
  stintsByDriver: Map<number, DriverStintInfo>,
  scPeriods: readonly SafetyCarPeriod[],
): Promise<DriverTraceAccumulator[]> {
  const traces: DriverTraceAccumulator[] = []
  for (const driver of drivers) {
    const trace = await buildDriverTrace(sessionKey, driver, resultMap, stintsByDriver, scPeriods)
    if (trace) traces.push(trace)
  }
  return traces
}

function buildTeamProfiles(
  drivers: OpenF1Driver[],
  traces: DriverTraceAccumulator[],
  resultMap: Map<number, DriverResultInfo>,
  corners: CornerDef[],
  straights: StraightDef[],
  totalLaps: number,
  validLapsByDriver: ReturnType<typeof normalizeAll>['validLapsByDriver'],
): TeamCarProfile[] {
  const codeMap = new Map(drivers.map((d) => [d.driver_number, d.name_acronym]))
  const teamGroups = buildTeamGroups(drivers, traces, resultMap)

  return teamGroups.map((group) => {
    const profile = aggregateTeam({
      teamName: group.teamName,
      teamColour: group.teamColour,
      driverNumbers: group.driverNumbers,
      validLapsByDriver,
      corners,
      straights,
      totalLaps,
    })
    return replaceSoloDriverCodes(profile, codeMap)
  })
}

export async function buildCornerAnalysisData(sessionKey: number): Promise<CornerAnalysisData> {
  // 1~5: 메타/드라이버/결과/스틴트/세이프티카 — 순차 실행
  const meta = await fetchSessionMeta(sessionKey)
  const drivers = await fetchSessionDrivers(sessionKey)
  const resultMap = await fetchSessionResultMap(sessionKey)
  const { totalLaps, stintsByDriver } = await fetchStintInfo(sessionKey)
  const raceControlEvents = await fetchRaceControlEvents(sessionKey)
  const scPeriods = buildSafetyCarPeriods(raceControlEvents)

  // 6: 드라이버별 순차 fetch + 유효 랩 슬라이스
  const traces = await collectDriverTraces(sessionKey, drivers, resultMap, stintsByDriver, scPeriods)
  if (traces.length === 0) throw new Error('유효한 랩 데이터를 가진 드라이버가 없습니다.')

  // 7: 기준 랩 선정 (전체 유효 랩 중 lap_duration 최소)
  const refKey = pickReferenceLap(traces)
  if (!refKey) throw new Error('기준 랩을 선정할 수 없습니다.')

  // 8: 전체 세션 취합 좌표로 SVG 정규화
  const { validLapsByDriver, refLapTrackPoints, trackPath, bounds } = normalizeAll(traces, refKey)

  // 9: 코너/직선 탐지
  const corners = detectCorners(refLapTrackPoints)
  const straights = detectStraights(corners)

  // 10~12: 팀 그룹핑 + 집계 + soloDriverCode 치환
  const teams = buildTeamProfiles(drivers, traces, resultMap, corners, straights, totalLaps, validLapsByDriver)

  // 13: 최종 조립
  return {
    sessionKey,
    circuitShortName: meta.circuitShortName,
    countryName: meta.countryName,
    totalLaps,
    algoVersion: ALGO_VERSION,
    bounds,
    trackPath,
    corners,
    straights,
    teams,
  }
}
