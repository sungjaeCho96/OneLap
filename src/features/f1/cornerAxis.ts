// "팀별 코너 강점 분석" UI 전용 축(axis) 매핑 — Phase A/B 타입(cornerAnalysis.ts)을 소비만 하고
// 화면에 필요한 라벨/점수/상태 선택 로직만 이 파일에 모아둔다.

import type { AxisStatus, CornerType, TeamCarProfile } from './cornerAnalysis'

export type AnalysisAxis = 'aero' | 'mechanical' | 'straight'

export const AXIS_LABELS: Record<AnalysisAxis, string> = {
  aero: '에어로',
  mechanical: '기계적 그립',
  straight: '직진 가속',
}

export const AXIS_UNITS: Record<AnalysisAxis, string> = {
  aero: 'km/h',
  mechanical: 'km/h',
  straight: 'km/h',
}

export const CORNER_TYPE_LABELS: Record<CornerType, string> = {
  HIGH: '고속',
  MID: '중속',
  LOW: '저속',
}

// MID 코너는 에어로/기계적그립 어느 결론에도 쓰이지 않는다 — 참고용으로만 표시
export const CORNER_TYPE_TO_AXIS: Record<CornerType, AnalysisAxis | null> = {
  HIGH: 'aero',
  MID: null,
  LOW: 'mechanical',
}

export function axisScore(team: TeamCarProfile, axis: AnalysisAxis): number | null {
  if (axis === 'aero') return team.aeroScore
  if (axis === 'mechanical') return team.mechanicalScore
  return team.straightScore
}

// straight축은 TeamCarProfile에 별도 status 필드가 없어 straightScore null 여부로 대체 판정한다
export function axisStatus(team: TeamCarProfile, axis: AnalysisAxis): AxisStatus {
  if (axis === 'aero') return team.aeroStatus
  if (axis === 'mechanical') return team.mechanicalStatus
  return team.straightScore == null ? 'INSUFFICIENT_SAMPLE' : 'OK'
}

export function pickDefaultTeam(teams: TeamCarProfile[]): string {
  const eligible = teams.find((t) => t.meetsLapThreshold)
  return (eligible ?? teams[0])?.teamName ?? ''
}
