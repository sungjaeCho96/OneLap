'use client'

import type { TrackSpeedData } from '@/features/f1/trackSpeed'
import { TIE_COLOR } from '@/features/f1/speedColor'
import type { DriverColorPair } from '@/features/f1/speedColor'

interface SpeedReadoutProps {
  data: TrackSpeedData
  driverColors: DriverColorPair
  tieColor?: string
  cornerD: number | null
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
  driverColors,
  tieColor = TIE_COLOR,
  cornerD,
}: SpeedReadoutProps) {
  const [dA, dB] = data.drivers
  const [colorA, colorB] = driverColors
  const ptA = cornerD != null ? findClosestPoint(dA.points, cornerD) : null
  const ptB = cornerD != null ? findClosestPoint(dB.points, cornerD) : null

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
      {/* Driver legend — 3 chips */}
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
          드라이버 범례
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <LegendChip color={colorA} label={dA.code} />
          <LegendChip color={colorB} label={dB.code} />
          <LegendChip color={tieColor} label="동률" />
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
              aColour={colorA}
              bColour={colorB}
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
              aColour={colorA}
              bColour={colorB}
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
              aColour={colorA}
              bColour={colorB}
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
                <BrakeIndicator code={dA.code} active={ptA.brake > 0} colour={colorA} />
                <BrakeIndicator code={dB.code} active={ptB.brake > 0} colour={colorB} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function LegendChip({ color, label }: { color: string; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        background: '#15120D',
        borderRadius: 2,
        border: `1px solid ${color}44`,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          color: color,
          letterSpacing: '0.05em',
        }}
      >
        {label}
      </span>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: aColour }}>{aCode}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: aColour, whiteSpace: 'nowrap' }}>{aVal}</span>
        </div>
        {ahead && absDelta > 0 && (
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', alignSelf: 'center', whiteSpace: 'nowrap' }}>
            {ahead} +{absDelta.toFixed(0)}{unit}
          </span>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: bColour }}>{bCode}</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 14, fontWeight: 700, color: bColour, whiteSpace: 'nowrap' }}>{bVal}</span>
        </div>
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
