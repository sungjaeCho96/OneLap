'use client'

import { useState } from 'react'
import type { PitStrategyData } from '@/features/f1/pitStrategy'
import { TYRE_COLORS, TYRE_LABELS } from '@/features/f1/pitStrategy'
import DriverLane from './DriverLane'
import type { HoverInfo } from './DriverLane'

const CARD_BG = '#1E1A13'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'

interface StintChartProps {
  data: PitStrategyData
}

interface XAxisProps {
  totalLaps: number
}

function XAxis({ totalLaps }: XAxisProps) {
  const positions = [0, 0.25, 0.5, 0.75, 1] as const
  const labels = positions.map((p) => (p === 0 ? 'LAP 0' : `LAP ${Math.round(p * totalLaps)}`))

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
      <div style={{ width: 64, flexShrink: 0 }} />
      <div style={{ flex: 1, position: 'relative', height: 20 }}>
        {positions.map((pos, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${pos * 100}%`,
              transform:
                i === 0
                  ? 'none'
                  : i === positions.length - 1
                    ? 'translateX(-100%)'
                    : 'translateX(-50%)',
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              color: MUTED,
              whiteSpace: 'nowrap',
              letterSpacing: '0.04em',
            }}
          >
            {labels[i]}
          </div>
        ))}
      </div>
    </div>
  )
}

interface TooltipProps {
  info: HoverInfo
}

function Tooltip({ info }: TooltipProps) {
  const { stint, x, y } = info
  const isRightHalf =
    typeof window !== 'undefined' ? x > window.innerWidth / 2 : false

  return (
    <div
      style={{
        position: 'fixed',
        left: x + 14,
        top: y + 14,
        zIndex: 30,
        pointerEvents: 'none',
        background: CARD_BG,
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        padding: '10px 14px',
        minWidth: 170,
        transform: isRightHalf ? 'translateX(calc(-100% - 28px))' : 'none',
      }}
    >
      {/* Compound row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: TYRE_COLORS[stint.compound],
            flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        />
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 12,
            color: TEXT,
          }}
        >
          {TYRE_LABELS[stint.compound]}
        </span>
      </div>

      {/* Lap range */}
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          color: MUTED,
          marginBottom: 4,
        }}
      >
        Lap {stint.lapStart}–{stint.lapEnd} ({stint.lapCount}랩)
      </div>

      {/* Tyre age */}
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          color: MUTED,
          marginBottom: stint.pitDuration != null ? 4 : 0,
        }}
      >
        타이어:{' '}
        {stint.tyreAgeAtStart === 0
          ? '신품'
          : `중고 (${stint.tyreAgeAtStart}랩 경과)`}
      </div>

      {/* Pit duration */}
      {stint.pitDuration != null && (
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            color: MUTED,
          }}
        >
          피트: {stint.pitDuration.toFixed(1)}s
        </div>
      )}
    </div>
  )
}

export default function StintChart({ data }: StintChartProps) {
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null)

  if (data.drivers.length === 0) {
    return (
      <div
        style={{
          padding: '40px 24px',
          textAlign: 'center',
          fontFamily: "'Space Mono', monospace",
          fontSize: 13,
          color: MUTED,
        }}
      >
        이 레이스의 데이터가 아직 없습니다.
      </div>
    )
  }

  return (
    <div style={{ padding: '16px 20px 20px' }}>
      <XAxis totalLaps={data.totalLaps} />

      <div>
        {data.drivers.map((driver) => (
          <DriverLane
            key={driver.driverNumber}
            driver={driver}
            totalLaps={data.totalLaps}
            onHover={setHoverInfo}
          />
        ))}
      </div>

      {hoverInfo && <Tooltip info={hoverInfo} />}
    </div>
  )
}
