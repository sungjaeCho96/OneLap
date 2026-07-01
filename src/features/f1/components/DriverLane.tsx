import type { DriverStrategy, Stint } from '@/features/f1/pitStrategy'
import { TYRE_COLORS } from '@/features/f1/pitStrategy'

const BG = '#15120D'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'

export interface HoverInfo {
  driverNumber: number
  stint: Stint
  x: number
  y: number
}

interface DriverLaneProps {
  driver: DriverStrategy
  totalLaps: number
  onHover: (info: HoverInfo | null) => void
}

interface DriverTagProps {
  driver: DriverStrategy
}

function DriverTag({ driver }: DriverTagProps) {
  return (
    <div
      style={{
        width: 64,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        paddingRight: 8,
      }}
    >
      <div
        style={{
          width: 4,
          height: 24,
          borderRadius: 2,
          background: driver.teamColour,
          flexShrink: 0,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, minWidth: 0 }}>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 10,
            color: TEXT,
            letterSpacing: '0.04em',
          }}
        >
          {driver.nameAcronym}
        </span>
        {driver.raceStatus && (
          <span
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 8,
              color: '#E10600',
              letterSpacing: '0.02em',
              flexShrink: 0,
            }}
          >
            {driver.raceStatus}
          </span>
        )}
      </div>
    </div>
  )
}

interface StintBlockProps {
  stint: Stint
  totalLaps: number
  driverNumber: number
  onHover: (info: HoverInfo | null) => void
}

function StintBlock({ stint, totalLaps, driverNumber, onHover }: StintBlockProps) {
  const leftPct = ((stint.lapStart - 1) / totalLaps) * 100
  const widthPct = (stint.lapCount / totalLaps) * 100

  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftPct}%`,
        width: `${widthPct}%`,
        top: 0,
        bottom: 0,
        background: TYRE_COLORS[stint.compound],
        border: '1px solid rgba(0,0,0,0.2)',
        boxSizing: 'border-box',
        cursor: 'pointer',
      }}
      onMouseMove={(e) => {
        onHover({ driverNumber, stint, x: e.clientX, y: e.clientY })
      }}
      onMouseLeave={() => onHover(null)}
    />
  )
}

interface PitMarkerProps {
  lapStart: number
  totalLaps: number
}

function PitMarker({ lapStart, totalLaps }: PitMarkerProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${((lapStart - 1) / totalLaps) * 100}%`,
        top: 0,
        bottom: 0,
        width: 2,
        background: BG,
        zIndex: 1,
        pointerEvents: 'none',
      }}
    />
  )
}

export default function DriverLane({ driver, totalLaps, onHover }: DriverLaneProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 4,
      }}
    >
      <DriverTag driver={driver} />
      <div
        style={{
          flex: 1,
          height: 28,
          position: 'relative',
          background: MUTED + '22',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {driver.stints.map((stint) => (
          <StintBlock
            key={stint.stintNumber}
            stint={stint}
            totalLaps={totalLaps}
            driverNumber={driver.driverNumber}
            onHover={onHover}
          />
        ))}
        {/* Pit markers at the start of each non-first stint */}
        {driver.stints.slice(1).map((stint) => (
          <PitMarker
            key={`pit-${stint.stintNumber}`}
            lapStart={stint.lapStart}
            totalLaps={totalLaps}
          />
        ))}
      </div>
    </div>
  )
}
