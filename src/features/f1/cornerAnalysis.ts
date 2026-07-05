import type { TrackPoint } from './trackSpeed'

// ─── Types ─────────────────────────────────────────────────────────────────

export type CornerType = 'HIGH' | 'MID' | 'LOW'

export interface CornerDef {
  index: number
  apexD: number
  entryD: number
  exitD: number
  apexX: number
  apexY: number
  type: CornerType
  refApexSpeed: number
}

export interface StraightDef {
  index: number
  fromCornerIndex: number
  toCornerIndex: number
  startD: number
  endD: number
  midX: number
  midY: number
}

export interface TeamCornerMetric {
  cornerIndex: number
  apexSpeedMedian: number | null
  driverCount: number
  soloDriverCode?: string
}

export interface TeamStraightMetric {
  straightIndex: number
  topSpeedMedian: number | null
  accelRateMedian: number | null
  driverCount: number
  soloDriverCode?: string
}

export type AxisStatus = 'OK' | 'INSUFFICIENT_SAMPLE' | 'INSUFFICIENT_LAPS'

export interface TeamCarProfile {
  teamName: string
  teamColour: string
  driverNumbers: number[]
  meetsLapThreshold: boolean
  aeroStatus: AxisStatus
  mechanicalStatus: AxisStatus
  aeroScore: number | null
  mechanicalScore: number | null
  straightScore: number | null
  corners: TeamCornerMetric[]
  straights: TeamStraightMetric[]
  isSingleDriver: boolean
}

// ─── Constants ───────────────────────────────────────────────────────────────
// 아래 상수는 실데이터(실제 세션) 검증 전 초기값 — 눈으로 결과를 검토하며 조정 필요.

export const SPEED_SMOOTH_WINDOW = 5 // TODO(실데이터 검증)
export const MIN_CORNER_SEPARATION_D = 0.015 // TODO(실데이터 검증)
export const MIN_APEX_PROMINENCE_KMH = 10 // TODO(실데이터 검증) — 15에서 하향, 완만한 고속 코너의 얕은 감속폭도 인정
export const BRAKE_CONFIRM_WINDOW_D = 0.03 // TODO(실데이터 검증)
// 스로틀이 이 값 밑으로 떨어지면 브레이크 없이 리프트만 한 경우도 감속 의도로 인정한다.
// 고속 코너는 브레이크 없이 스로틀만 살짝 떼고 통과하는 경우가 많아, 브레이크만 요구하면 고속 코너가 체계적으로 걸러진다.
export const THROTTLE_LIFT_THRESHOLD = 90 // TODO(실데이터 검증)
export const CORNER_WINDOW_D = 0.02 // TODO(실데이터 검증)
export const OUTLIER_SLOW_THRESHOLD = 0.05 // TODO(실데이터 검증)
export const MIN_INSTANCE_SAMPLE = 3 // TODO(실데이터 검증)
export const STRAIGHT_ACCEL_SPAN_D = 0.05 // TODO(실데이터 검증)
export const HIGH_SPEED_CORNER_KMH = 200 // TODO(실데이터 검증)
export const LOW_SPEED_CORNER_KMH = 125 // TODO(실데이터 검증)
export const MIN_CORNER_SAMPLE = 2 // TODO(실데이터 검증)
export const ALGO_VERSION = 2 // 코너 탐지 임계값 변경(브레이크→감속 확증, prominence 하향)으로 캐시 무효화

// ─── Corner classification ────────────────────────────────────────────────────

export function classifyCorner(refApexSpeed: number): CornerType {
  if (refApexSpeed >= HIGH_SPEED_CORNER_KMH) return 'HIGH'
  if (refApexSpeed <= LOW_SPEED_CORNER_KMH) return 'LOW'
  return 'MID'
}

// ─── Corner detection ─────────────────────────────────────────────────────────

function movingAverage(values: number[], radius: number): number[] {
  return values.map((_, i) => {
    const lo = Math.max(0, i - radius)
    const hi = Math.min(values.length - 1, i + radius)
    let sum = 0
    for (let j = lo; j <= hi; j++) sum += values[j]
    return sum / (hi - lo + 1)
  })
}

function findLocalMinCandidates(sm: number[]): number[] {
  const candidates: number[] = []
  for (let i = 1; i < sm.length - 1; i++) {
    if (sm[i] <= sm[i - 1] && sm[i] < sm[i + 1]) candidates.push(i)
  }
  return candidates
}

// 후보 i의 좌우 인접 후보(또는 배열 끝) 사이 구간 최댓값 기준 prominence 계산
function filterByProminence(sm: number[], candidates: number[]): number[] {
  return candidates.filter((idx, k) => {
    const leftBound = k === 0 ? 0 : candidates[k - 1]
    const rightBound = k === candidates.length - 1 ? sm.length - 1 : candidates[k + 1]

    let leftMax = -Infinity
    for (let j = leftBound; j <= idx; j++) leftMax = Math.max(leftMax, sm[j])
    let rightMax = -Infinity
    for (let j = idx; j <= rightBound; j++) rightMax = Math.max(rightMax, sm[j])

    return Math.min(leftMax, rightMax) - sm[idx] >= MIN_APEX_PROMINENCE_KMH
  })
}

// apex 이전 BRAKE_CONFIRM_WINDOW_D 구간에 브레이크 또는 스로틀 리프트 흔적이 있어야 실제 코너로 확정.
// 브레이크만 요구하면 고속 코너(스로틀 리프트만으로 통과)가 체계적으로 걸러지므로 둘 중 하나만 있어도 인정한다.
function hasDecelerationConfirmation(points: TrackPoint[], apexD: number): boolean {
  const lo = apexD - BRAKE_CONFIRM_WINDOW_D
  return points.some(
    (p) => p.d >= lo && p.d <= apexD && (p.brake > 0 || p.throttle < THROTTLE_LIFT_THRESHOLD),
  )
}

// d 간격이 MIN_CORNER_SEPARATION_D 미만인 후보끼리는 더 느린(=더 낮은 speed) 후보만 남긴다
function mergeCloseCandidates(sm: number[], points: TrackPoint[], indices: number[]): number[] {
  const sorted = [...indices].sort((a, b) => points[a].d - points[b].d)
  const merged: number[] = []

  for (const idx of sorted) {
    const last = merged[merged.length - 1]
    if (last !== undefined && points[idx].d - points[last].d < MIN_CORNER_SEPARATION_D) {
      if (sm[idx] < sm[last]) merged[merged.length - 1] = idx
      continue
    }
    merged.push(idx)
  }

  return merged
}

function nearestLocalMaxLeft(sm: number[], idx: number): number {
  for (let j = idx - 1; j > 0; j--) {
    if (sm[j] >= sm[j - 1] && sm[j] >= sm[j + 1]) return j
  }
  return 0
}

function nearestLocalMaxRight(sm: number[], idx: number): number {
  for (let j = idx + 1; j < sm.length - 1; j++) {
    if (sm[j] >= sm[j - 1] && sm[j] >= sm[j + 1]) return j
  }
  return sm.length - 1
}

export function detectCorners(refLap: TrackPoint[]): CornerDef[] {
  const speeds = refLap.map((p) => p.speed)
  const sm = movingAverage(speeds, SPEED_SMOOTH_WINDOW)

  const candidates = findLocalMinCandidates(sm)
  const prominent = filterByProminence(sm, candidates)
  const decelConfirmed = prominent.filter((idx) => hasDecelerationConfirmation(refLap, refLap[idx].d))
  const finalIndices = mergeCloseCandidates(sm, refLap, decelConfirmed)

  return finalIndices
    .sort((a, b) => refLap[a].d - refLap[b].d)
    .map((idx, i) => {
      const entryIdx = nearestLocalMaxLeft(sm, idx)
      const exitIdx = nearestLocalMaxRight(sm, idx)
      const refApexSpeed = sm[idx]
      return {
        index: i + 1,
        apexD: refLap[idx].d,
        entryD: refLap[entryIdx].d,
        exitD: refLap[exitIdx].d,
        apexX: refLap[idx].x,
        apexY: refLap[idx].y,
        type: classifyCorner(refApexSpeed),
        refApexSpeed,
      }
    })
}

// ─── Straight detection ────────────────────────────────────────────────────────

// midX/midY는 CornerDef만으로 구할 수 있는 값이 apex 좌표뿐이라 양끝 코너 apex의 중점으로 근사한다
export function detectStraights(corners: CornerDef[]): StraightDef[] {
  const sorted = [...corners].sort((a, b) => a.apexD - b.apexD)
  const n = sorted.length
  if (n === 0) return []

  return sorted.map((corner, i) => {
    const next = sorted[(i + 1) % n]
    return {
      index: i + 1,
      fromCornerIndex: corner.index,
      toCornerIndex: next.index,
      startD: corner.exitD,
      endD: next.entryD,
      midX: (corner.apexX + next.apexX) / 2,
      midY: (corner.apexY + next.apexY) / 2,
    }
  })
}
