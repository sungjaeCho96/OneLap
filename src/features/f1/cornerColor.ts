import type { CornerType } from './cornerAnalysis'

export type AxisKind = 'aero' | 'mechanical' | 'straight'

const FAST_COLOR: [number, number, number] = [0x22, 0xc5, 0x5e] // #22C55E, 빠름/강함
const NEUTRAL_COLOR: [number, number, number] = [0x6b, 0x72, 0x80] // #6B7280, 중앙
const SLOW_COLOR: [number, number, number] = [0xef, 0x44, 0x44] // #EF4444, 느림/약함

export const UNAVAILABLE_COLOR = '#4B5563'

export const CORNER_TYPE_MARKER: Record<CornerType, 'diamond' | 'square' | 'circle'> = {
  HIGH: 'diamond',
  MID: 'square',
  LOW: 'circle',
}

function lerp(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t)
}

function toHex(rgb: [number, number, number]): string {
  return `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

// delta > 0(빠름/강함)일수록 초록, delta < 0일수록 빨강, 0 근방은 회색으로 보간
export function deltaToColor(delta: number, maxAbs: number): string {
  if (maxAbs <= 0) return toHex(NEUTRAL_COLOR)

  const t = Math.max(-1, Math.min(1, delta / maxAbs))
  const endColor = t >= 0 ? FAST_COLOR : SLOW_COLOR
  const f = Math.abs(t)

  return toHex([
    lerp(NEUTRAL_COLOR[0], endColor[0], f),
    lerp(NEUTRAL_COLOR[1], endColor[1], f),
    lerp(NEUTRAL_COLOR[2], endColor[2], f),
  ])
}
