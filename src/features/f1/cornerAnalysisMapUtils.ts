// CornerTrackMap.tsx 전용 순수 계산 유틸 — 필드 중앙값, 팀별 델타 스케일, 트랙 좌표→d 역산.
// 컴포넌트 파일 크기를 줄이고 단위 테스트하기 쉽게 분리한다.

import type { CornerDef, CornerType, TeamCarProfile } from './cornerAnalysis'

export interface TrackPathPoint {
  x: number
  y: number
}

function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

// cornerIndex → 전체 팀 apexSpeedMedian의 중앙값("필드 중앙값")
export function fieldMedianByCorner(teams: TeamCarProfile[]): Map<number, number | null> {
  const grouped = new Map<number, number[]>()
  for (const team of teams) {
    for (const metric of team.corners) {
      if (metric.apexSpeedMedian == null) continue
      grouped.set(metric.cornerIndex, [...(grouped.get(metric.cornerIndex) ?? []), metric.apexSpeedMedian])
    }
  }
  return new Map(Array.from(grouped.entries()).map(([idx, values]) => [idx, median(values)]))
}

// straightIndex → 전체 팀 topSpeedMedian의 중앙값
export function fieldMedianByStraight(teams: TeamCarProfile[]): Map<number, number | null> {
  const grouped = new Map<number, number[]>()
  for (const team of teams) {
    for (const metric of team.straights) {
      if (metric.topSpeedMedian == null) continue
      grouped.set(metric.straightIndex, [...(grouped.get(metric.straightIndex) ?? []), metric.topSpeedMedian])
    }
  }
  return new Map(Array.from(grouped.entries()).map(([idx, values]) => [idx, median(values)]))
}

// 코너 타입(HIGH/MID/LOW)별로 색 스케일을 고정해, axis를 토글해도 같은 타입 코너의 색 강도가 흔들리지 않게 한다
export function maxAbsDeltaByCornerType(
  teams: TeamCarProfile[],
  corners: CornerDef[],
  fieldMedian: Map<number, number | null>,
): Record<CornerType, number> {
  const result: Record<CornerType, number> = { HIGH: 0, MID: 0, LOW: 0 }
  const typeByIndex = new Map(corners.map((c) => [c.index, c.type]))

  for (const team of teams) {
    for (const metric of team.corners) {
      if (metric.apexSpeedMedian == null) continue
      const fm = fieldMedian.get(metric.cornerIndex)
      const type = typeByIndex.get(metric.cornerIndex)
      if (fm == null || !type) continue
      const abs = Math.abs(metric.apexSpeedMedian - fm)
      if (abs > result[type]) result[type] = abs
    }
  }
  return result
}

export function maxAbsDeltaForStraights(
  teams: TeamCarProfile[],
  fieldMedian: Map<number, number | null>,
): number {
  let max = 0
  for (const team of teams) {
    for (const metric of team.straights) {
      if (metric.topSpeedMedian == null) continue
      const fm = fieldMedian.get(metric.straightIndex)
      if (fm == null) continue
      const abs = Math.abs(metric.topSpeedMedian - fm)
      if (abs > max) max = abs
    }
  }
  return max
}

interface Anchor {
  index: number
  d: number
}

// API 응답의 trackPath는 {x,y}만 내려주고 포인트별 d를 포함하지 않는다(Phase B 계약).
// 코너 apex 좌표(apexX/apexY)는 trackPath와 동일한 refLap 포인트에서 반올림 생성되었으므로
// 좌표 일치로 앵커를 찾고, 앵커 사이 구간은 누적 호(arc) 길이 비율로 d를 선형 보간한다.
// d는 0..1 순환값(cornerMetrics.ts 주석 참고)이라 실제 트랙 형상과 arc 길이 비율이 잘 맞아떨어진다.
export function buildIndexToD(trackPath: TrackPathPoint[], corners: CornerDef[]): number[] {
  const n = trackPath.length
  if (n === 0) return []

  const arcLen = new Array<number>(n).fill(0)
  for (let i = 1; i < n; i++) {
    arcLen[i] = arcLen[i - 1] + Math.hypot(trackPath[i].x - trackPath[i - 1].x, trackPath[i].y - trackPath[i - 1].y)
  }
  const totalArc = arcLen[n - 1]

  const anchors: Anchor[] = corners
    .map((corner) => ({
      index: trackPath.findIndex((p) => p.x === corner.apexX && p.y === corner.apexY),
      d: corner.apexD,
    }))
    .filter((a) => a.index >= 0)
    .sort((a, b) => a.index - b.index)

  if (anchors.length === 0) {
    return totalArc > 0 ? arcLen.map((a) => a / totalArc) : arcLen.map(() => 0)
  }

  const slope = (from: Anchor, to: Anchor): number => {
    const arcSpan = arcLen[to.index] - arcLen[from.index]
    return arcSpan !== 0 ? (to.d - from.d) / arcSpan : 0
  }

  const first = anchors[0]
  const last = anchors[anchors.length - 1]
  const leadSlope = anchors.length > 1 ? slope(first, anchors[1]) : totalArc > 0 ? 1 / totalArc : 0
  const tailSlope = anchors.length > 1 ? slope(anchors[anchors.length - 2], last) : totalArc > 0 ? 1 / totalArc : 0

  const extended: Anchor[] = [
    { index: 0, d: first.d - leadSlope * (arcLen[first.index] - arcLen[0]) },
    ...anchors,
    { index: n - 1, d: last.d + tailSlope * (arcLen[n - 1] - arcLen[last.index]) },
  ]

  const indexToD = new Array<number>(n)
  let seg = 0
  for (let i = 0; i < n; i++) {
    while (seg < extended.length - 2 && i > extended[seg + 1].index) seg++
    const lo = extended[seg]
    const hi = extended[seg + 1]
    const span = arcLen[hi.index] - arcLen[lo.index]
    const t = span !== 0 ? (arcLen[i] - arcLen[lo.index]) / span : 0
    indexToD[i] = lo.d + (hi.d - lo.d) * t
  }
  return indexToD
}

// [startD, endD] 범위에 속하는 trackPath 포인트를 뽑아 폴리라인 좌표 배열로 반환한다.
// startD > endD면 트랙 시작/종료선을 넘어 순환하는 구간이므로 두 개의 폴리라인으로 나눈다.
export function pointsInDRange(
  trackPath: TrackPathPoint[],
  indexToD: number[],
  startD: number,
  endD: number,
): TrackPathPoint[][] {
  if (startD <= endD) {
    const pts = trackPath.filter((_, i) => indexToD[i] >= startD && indexToD[i] <= endD)
    return pts.length >= 2 ? [pts] : []
  }
  const tail = trackPath.filter((_, i) => indexToD[i] >= startD)
  const head = trackPath.filter((_, i) => indexToD[i] <= endD)
  return [tail, head].filter((seg) => seg.length >= 2)
}
