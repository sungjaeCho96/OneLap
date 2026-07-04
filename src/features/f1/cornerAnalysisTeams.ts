// team_name 기준 드라이버 그룹핑 + aggregateTeam 결과의 soloDriverCode(드라이버 번호 문자열)를
// 실제 3글자 드라이버 코드로 치환하는 후처리.

import type { OpenF1Driver } from './openf1'
import type { TeamCarProfile } from './cornerAnalysis'
import type { DriverTraceAccumulator } from './cornerAnalysisDriverTrace'
import type { DriverResultInfo } from './openf1CornerFetch'

export interface TeamGroup {
  teamName: string
  teamColour: string
  driverNumbers: number[]
}

export function buildTeamGroups(
  drivers: OpenF1Driver[],
  accumulators: DriverTraceAccumulator[],
  resultMap: Map<number, DriverResultInfo>,
): TeamGroup[] {
  const accByDriver = new Map(accumulators.map((a) => [a.driverNumber, a]))
  const byTeam = new Map<string, { teamColour: string; driverNumbers: number[] }>()

  for (const driver of drivers) {
    const acc = accByDriver.get(driver.driver_number)
    if (!acc || acc.validLaps.length === 0) continue // 유효 랩이 있는 드라이버만 팀 그룹에 포함

    const entry = byTeam.get(driver.team_name) ?? { teamColour: acc.teamColour, driverNumbers: [] }
    byTeam.set(driver.team_name, {
      teamColour: entry.teamColour,
      driverNumbers: [...entry.driverNumbers, driver.driver_number],
    })
  }

  return Array.from(byTeam.entries()).map(([teamName, { teamColour, driverNumbers }]) => ({
    teamName,
    teamColour,
    // 드라이버 교체 등으로 유효 랩 보유 드라이버가 3명 이상 잡히면, 레이스를 더 많이 뛴(=number_of_laps 큰)
    // 상위 2명만 사용한다 — 실질적으로 그 세션에서 그 팀 차를 대표하는 드라이버로 간주.
    driverNumbers:
      driverNumbers.length > 2
        ? [...driverNumbers]
            .sort((a, b) => (resultMap.get(b)?.numberOfLaps ?? 0) - (resultMap.get(a)?.numberOfLaps ?? 0))
            .slice(0, 2)
        : driverNumbers,
  }))
}

function replaceSoloCode<T extends { soloDriverCode?: string }>(
  metrics: T[],
  codeMap: Map<number, string>,
): T[] {
  return metrics.map((m) =>
    m.soloDriverCode ? { ...m, soloDriverCode: codeMap.get(Number(m.soloDriverCode)) ?? m.soloDriverCode } : m,
  )
}

export function replaceSoloDriverCodes(
  profile: TeamCarProfile,
  codeMap: Map<number, string>,
): TeamCarProfile {
  return {
    ...profile,
    corners: replaceSoloCode(profile.corners, codeMap),
    straights: replaceSoloCode(profile.straights, codeMap),
  }
}
