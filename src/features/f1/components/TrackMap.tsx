'use client'

import { useState } from 'react'
import type { TrackSpeedData } from '@/features/f1/trackSpeed'
import { findClosestByD } from '@/features/f1/trackSpeed'
import {
  interpolateSpeedAtD,
  pickFasterColor,
  TIE_COLOR,
  SPEED_TIE_THRESHOLD,
} from '@/features/f1/speedColor'
import type { DriverColorPair } from '@/features/f1/speedColor'
import SpeedTooltip from './SpeedTooltip'

interface TrackMapProps {
  data: TrackSpeedData
  driverColors: DriverColorPair
  tieColor?: string
  pinnedD: number | null
  onPick: (d: number) => void
}

export default function TrackMap({
  data,
  driverColors,
  tieColor = TIE_COLOR,
  pinnedD,
  onPick,
}: TrackMapProps) {
  const [hoverD, setHoverD] = useState<number | null>(null)

  const { bounds } = data
  const ref = data.drivers[0].points
  const other = data.drivers[1].points
  const [colorRef, colorOther] = driverColors

  // 클릭 고정 포인트 인덱스
  const pinnedIdx = pinnedD != null
    ? ref.reduce<number>((best, p, i) => {
        const diff = Math.abs(p.d - pinnedD)
        const bestDiff = Math.abs(ref[best].d - pinnedD)
        return diff < bestDiff ? i : best
      }, 0)
    : null

  // hover 포인트 데이터 (툴팁용)
  const hoverPtA = hoverD != null ? findClosestByD(ref, hoverD) : null
  const hoverPtB = hoverD != null ? findClosestByD(other, hoverD) : null

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox={`0 0 ${bounds.viewBox} ${bounds.viewBox}`}
        style={{
          width: '100%',
          height: '100%',
          background: '#15120D',
          borderRadius: 4,
          display: 'block',
        }}
        aria-label="트랙 속도 맵"
      >
        {/* 세그먼트별 색상 — 더 빠른 드라이버 고정색 방식 */}
        {ref.slice(0, -1).map((p, i) => {
          const next = ref[i + 1]
          const refSpeed = (p.speed + next.speed) / 2
          const dMid = (p.d + next.d) / 2
          const otherSpeed = interpolateSpeedAtD(other, dMid)
          const stroke = pickFasterColor(
            refSpeed,
            otherSpeed,
            colorRef,
            colorOther,
            tieColor,
            SPEED_TIE_THRESHOLD,
          )
          return (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke={stroke}
              strokeWidth={10}
              strokeLinecap="round"
            />
          )
        })}

        {/* Always-visible comparison markers */}
        {ref.map((p, i) => {
          if (i % 20 !== 0) return null
          const isActive = i === pinnedIdx
          return (
            <circle
              key={`marker-${p.d}`}
              cx={p.x}
              cy={p.y}
              r={isActive ? 10 : 6}
              fill="#15120D"
              stroke={isActive ? '#fff' : 'rgba(255,255,255,0.85)'}
              strokeWidth={isActive ? 2.5 : 2}
              style={{ pointerEvents: 'none' }}
            />
          )
        })}

        {/* Hit targets — every ~20th point to avoid overlap */}
        {ref
          .filter((_, i) => i % 20 === 0)
          .map((p) => (
            <circle
              key={p.d}
              cx={p.x}
              cy={p.y}
              r={14}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoverD(p.d)}
              onMouseLeave={() => setHoverD(null)}
              onClick={() => onPick(p.d)}
            />
          ))}
      </svg>

      {/* Floating tooltip */}
      {hoverPtA && hoverPtB && (
        <SpeedTooltip
          leftPct={hoverPtA.x / 10}
          topPct={hoverPtA.y / 10}
          rowA={{ code: data.drivers[0].code, color: colorRef, speed: hoverPtA.speed, gear: hoverPtA.gear }}
          rowB={{ code: data.drivers[1].code, color: colorOther, speed: hoverPtB.speed, gear: hoverPtB.gear }}
        />
      )}
    </div>
  )
}
