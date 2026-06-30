export const SPEED_STOPS: { t: number; c: string }[] = [
  { t: 0.0, c: '#3b2fb0' },
  { t: 0.3, c: '#2f8fd2' },
  { t: 0.55, c: '#2fd27a' },
  { t: 0.8, c: '#f4c13b' },
  { t: 1.0, c: '#E10600' },
]

export const SPEED_TIE_THRESHOLD = 3
export const TIE_COLOR = '#6B6051'
export type DriverColorPair = readonly [string, string]

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export function resolveDriverColors(a: string, b: string): DriverColorPair {
  const [r1, g1, b1] = hexToRgb(a)
  const [r2, g2, b2] = hexToRgb(b)
  const dist = Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
  if (dist < 80) return ['#3B82F6', '#EF4444']
  return [a, b]
}

export function interpolateSpeedAtD(
  points: { d: number; speed: number }[],
  d: number,
): number {
  if (points.length < 2) return points[0]?.speed ?? 0
  if (d <= points[0].d) return points[0].speed
  const last = points[points.length - 1]
  if (d >= last.d) return last.speed

  // 이진탐색으로 points[lo].d <= d < points[hi].d 구간 탐색
  let lo = 0
  let hi = points.length - 1
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1
    if (points[mid].d <= d) lo = mid
    else hi = mid
  }

  const span = points[hi].d - points[lo].d
  const f = span === 0 ? 0 : (d - points[lo].d) / span
  return points[lo].speed + (points[hi].speed - points[lo].speed) * f
}

export function pickFasterColor(
  refSpeed: number,
  otherSpeed: number,
  refColor: string,
  otherColor: string,
  tieColor: string = TIE_COLOR,
  threshold: number = SPEED_TIE_THRESHOLD,
): string {
  const delta = refSpeed - otherSpeed
  if (Math.abs(delta) < threshold) return tieColor
  return delta > 0 ? refColor : otherColor
}

export function speedToColor(speed: number, min: number, max: number): string {
  const t = max === min ? 0 : Math.max(0, Math.min(1, (speed - min) / (max - min)))

  // Find the surrounding stops for linear interpolation
  let loIdx = 0
  for (let i = SPEED_STOPS.length - 2; i >= 0; i--) {
    if (t >= SPEED_STOPS[i].t) {
      loIdx = i
      break
    }
  }
  const lo = SPEED_STOPS[loIdx]
  const hi = SPEED_STOPS[Math.min(loIdx + 1, SPEED_STOPS.length - 1)]

  const range = hi.t - lo.t
  const f = range === 0 ? 0 : (t - lo.t) / range

  const [r1, g1, b1] = hexToRgb(lo.c)
  const [r2, g2, b2] = hexToRgb(hi.c)

  const r = Math.round(r1 + (r2 - r1) * f)
  const g = Math.round(g1 + (g2 - g1) * f)
  const b = Math.round(b1 + (b2 - b1) * f)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
