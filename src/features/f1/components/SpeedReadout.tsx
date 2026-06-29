'use client'

import type { TrackSpeedData } from '@/features/f1/trackSpeed'
import { SPEED_STOPS } from '@/features/f1/speedColor'

interface SpeedReadoutProps {
  data: TrackSpeedData
  activeIdx: 0 | 1
  cornerD: number | null
  onToggleActive: (idx: 0 | 1) => void
}

function findClosestPoint(
  points: TrackSpeedData['drivers'][0]['points'],
  d: number,
) {
  return points.reduce((best, p) =>
    Math.abs(p.d - d) < Math.abs(best.d - d) ? p : best,
  )
}

function LapTime({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60)
  const s = (seconds % 60).toFixed(3)
  return (
    <span style={{ fontFamily: "'Space Mono', monospace" }}>
      {m}:{s.padStart(6, '0')}
    </span>
  )
}

export default function SpeedReadout({
  data,
  activeIdx,
  cornerD,
  onToggleActive,
}: SpeedReadoutProps) {
  const [dA, dB] = data.drivers
  const ptA = cornerD != null ? findClosestPoint(dA.points, cornerD) : null
  const ptB = cornerD != null ? findClosestPoint(dB.points, cornerD) : null
  const { speedMin, speedMax } = data.bounds

  const gradientStops = SPEED_STOPS.map(
    (s) => `${s.c} ${(s.t * 100).toFixed(0)}%`,
  ).join(', ')

  return (
    <div
      style={{
        background: '#1E1A13',
        border: '1px solid #2C271F',
        borderRadius: 4,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Speed legend */}
      <div>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#857A6A',
            marginBottom: 8,
          }}
        >
          속도 범례
        </div>
        <div
          style={{
            height: 10,
            borderRadius: 2,
            background: `linear-gradient(to right, ${gradientStops})`,
            marginBottom: 6,
          }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: '#857A6A',
          }}
        >
          <span>{speedMin} km/h</span>
          <span>{speedMax} km/h</span>
        </div>
      </div>

      {/* Driver toggle */}
      <div>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#857A6A',
            marginBottom: 10,
          }}
        >
          표시 드라이버 선택
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {([dA, dB] as const).map((d, i) => {
            const idx = i as 0 | 1
            const isActive = activeIdx === idx
            return (
              <button
                key={d.driverNumber}
                onClick={() => onToggleActive(idx)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  borderRadius: 2,
                  border: `2px solid ${isActive ? d.teamColour : '#2C271F'}`,
                  background: isActive ? `${d.teamColour}22` : 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontWeight: 700,
                    fontSize: 14,
                    color: isActive ? d.teamColour : '#857A6A',
                    marginBottom: 2,
                  }}
                >
                  {d.code}
                </div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 10,
                    color: '#857A6A',
                  }}
                >
                  LAP {d.lapNumber} · <LapTime seconds={d.lapDuration} />
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Corner data */}
      <div>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#857A6A',
            marginBottom: 10,
          }}
        >
          구간 비교
        </div>

        {ptA == null || ptB == null ? (
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              color: '#4A3F35',
              padding: '16px 0',
              textAlign: 'center',
            }}
          >
            트랙 위 포인트를 클릭하세요
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Speed */}
            <DataRow
              label="속도"
              aVal={`${ptA.speed} km/h`}
              bVal={`${ptB.speed} km/h`}
              delta={ptA.speed - ptB.speed}
              unit="km/h"
              aColour={dA.teamColour}
              bColour={dB.teamColour}
              aCode={dA.code}
              bCode={dB.code}
            />
            {/* Gear */}
            <DataRow
              label="기어"
              aVal={`${ptA.gear}`}
              bVal={`${ptB.gear}`}
              delta={ptA.gear - ptB.gear}
              unit=""
              aColour={dA.teamColour}
              bColour={dB.teamColour}
              aCode={dA.code}
              bCode={dB.code}
            />
            {/* Throttle */}
            <DataRow
              label="스로틀"
              aVal={`${ptA.throttle}%`}
              bVal={`${ptB.throttle}%`}
              delta={ptA.throttle - ptB.throttle}
              unit="%"
              aColour={dA.teamColour}
              bColour={dB.teamColour}
              aCode={dA.code}
              bCode={dB.code}
            />
            {/* Brake */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 10px',
                background: '#15120D',
                borderRadius: 2,
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  color: '#857A6A',
                  textTransform: 'uppercase',
                }}
              >
                브레이크
              </span>
              <div style={{ display: 'flex', gap: 16 }}>
                <BrakeIndicator code={dA.code} active={ptA.brake > 0} colour={dA.teamColour} />
                <BrakeIndicator code={dB.code} active={ptB.brake > 0} colour={dB.teamColour} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface DataRowProps {
  label: string
  aVal: string
  bVal: string
  delta: number
  unit: string
  aColour: string
  bColour: string
  aCode: string
  bCode: string
}

function DataRow({ label, aVal, bVal, delta, unit, aColour, bColour, aCode, bCode }: DataRowProps) {
  const ahead = delta > 0 ? aCode : delta < 0 ? bCode : null
  const absDelta = Math.abs(delta)

  return (
    <div
      style={{
        padding: '8px 10px',
        background: '#15120D',
        borderRadius: 2,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: '#857A6A',
          textTransform: 'uppercase',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: aColour }}>
          {aCode} {aVal}
        </span>
        {ahead && absDelta > 0 && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A' }}>
            {ahead} +{absDelta.toFixed(unit === 'km/h' ? 0 : 0)}{unit}
          </span>
        )}
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: bColour }}>
          {bCode} {bVal}
        </span>
      </div>
    </div>
  )
}

function BrakeIndicator({ code, active, colour }: { code: string; active: boolean; colour: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: active ? '#E10600' : '#2C271F',
          border: `1px solid ${active ? '#E10600' : '#3A352C'}`,
        }}
      />
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: colour }}>
        {code}
      </span>
    </div>
  )
}
