'use client'

import type { TrackSpeedData } from '@/features/f1/trackSpeed'
import { speedToColor } from '@/features/f1/speedColor'

interface TrackMapProps {
  data: TrackSpeedData
  activeIdx: 0 | 1
  hoveredD: number | null
  onHover: (d: number | null) => void
  onPick: (d: number) => void
}

function TrackLines({
  points,
  isActive,
  speedMin,
  speedMax,
}: {
  points: TrackSpeedData['drivers'][0]['points']
  isActive: boolean
  speedMin: number
  speedMax: number
}) {
  return (
    <>
      {points.slice(0, -1).map((p, i) => {
        const next = points[i + 1]
        const avgSpeed = (p.speed + next.speed) / 2
        const stroke = isActive
          ? speedToColor(avgSpeed, speedMin, speedMax)
          : '#2a2520'
        return (
          <line
            key={i}
            x1={p.x}
            y1={p.y}
            x2={next.x}
            y2={next.y}
            stroke={stroke}
            strokeWidth={isActive ? 10 : 6}
            strokeLinecap="round"
          />
        )
      })}
    </>
  )
}

export default function TrackMap({
  data,
  activeIdx,
  hoveredD,
  onHover,
  onPick,
}: TrackMapProps) {
  const { bounds } = data
  const inactiveIdx: 0 | 1 = activeIdx === 0 ? 1 : 0
  const activeDriver = data.drivers[activeIdx]
  const inactiveDriver = data.drivers[inactiveIdx]

  // Find the closest point index by d-value for highlight
  const hoveredIdx = hoveredD != null
    ? activeDriver.points.reduce<number>((best, p, i) => {
        const diff = Math.abs(p.d - hoveredD)
        const bestDiff = Math.abs(activeDriver.points[best].d - hoveredD)
        return diff < bestDiff ? i : best
      }, 0)
    : null

  return (
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
      {/* Inactive driver rendered first (below) */}
      <TrackLines
        points={inactiveDriver.points}
        isActive={false}
        speedMin={bounds.speedMin}
        speedMax={bounds.speedMax}
      />

      {/* Active driver on top with speed colors */}
      <TrackLines
        points={activeDriver.points}
        isActive
        speedMin={bounds.speedMin}
        speedMax={bounds.speedMax}
      />

      {/* Hover highlight circle */}
      {hoveredIdx != null && (
        <circle
          cx={activeDriver.points[hoveredIdx].x}
          cy={activeDriver.points[hoveredIdx].y}
          r={14}
          fill="none"
          stroke="#fff"
          strokeWidth={2}
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Hit targets — every ~20th point to avoid overlap */}
      {activeDriver.points
        .filter((_, i) => i % 20 === 0)
        .map((p) => (
          <circle
            key={p.d}
            cx={p.x}
            cy={p.y}
            r={14}
            fill="transparent"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => onHover(p.d)}
            onMouseLeave={() => onHover(null)}
            onClick={() => onPick(p.d)}
          />
        ))}
    </svg>
  )
}
