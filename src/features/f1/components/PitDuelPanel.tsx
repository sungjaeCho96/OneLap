import type { DriverStrategy, PitDuel } from '@/features/f1/pitStrategy'

const BG = '#15120D'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'
const GREEN = '#39B54A'
const AMBER = '#FFB020'

interface PitDuelPanelProps {
  duels: readonly PitDuel[]
  drivers: readonly DriverStrategy[]
}

interface DuelDriverTagProps {
  driver: DriverStrategy | undefined
  lap: number | null
}

function DuelDriverTag({ driver, lap }: DuelDriverTagProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
      <div
        style={{
          width: 4,
          height: 20,
          borderRadius: 2,
          background: driver?.teamColour ?? MUTED,
          flexShrink: 0,
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span
          style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 12,
            color: TEXT,
            letterSpacing: '0.04em',
          }}
        >
          {driver?.nameAcronym ?? '???'}
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: MUTED }}>
          {lap != null ? `LAP ${lap}` : '미피트'}
        </span>
      </div>
    </div>
  )
}

interface OutcomeBadgeProps {
  outcome: PitDuel['outcome']
}

function OutcomeBadge({ outcome }: OutcomeBadgeProps) {
  const success = outcome === 'UNDERCUT_SUCCESS'
  const color = success ? GREEN : AMBER
  const label = success ? '언더컷 성공' : '오버컷 성공'

  return (
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.04em',
        color,
        border: `1px solid ${color}55`,
        background: `${color}1A`,
        borderRadius: 2,
        padding: '4px 8px',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  )
}

function DuelRow({ duel, driverMap }: { duel: PitDuel; driverMap: Map<number, DriverStrategy> }) {
  const undercutter = driverMap.get(duel.undercutterDriverNumber)
  const defender = driverMap.get(duel.defenderDriverNumber)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        padding: '10px 12px',
        borderRadius: 4,
        border: `1px solid ${BORDER}`,
        background: BG,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
        <DuelDriverTag driver={undercutter} lap={duel.undercutLap} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: MUTED }}>→</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: MUTED }}>
            {duel.gapAtUndercutSec.toFixed(1)}s
          </span>
        </div>
        <DuelDriverTag driver={defender} lap={duel.defenderPitLap} />
      </div>
      <OutcomeBadge outcome={duel.outcome} />
    </div>
  )
}

export default function PitDuelPanel({ duels, drivers }: PitDuelPanelProps) {
  const driverMap = new Map(drivers.map((d) => [d.driverNumber, d]))

  return (
    <div style={{ borderTop: `1px solid ${BORDER}`, padding: '20px' }}>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: MUTED,
          marginBottom: 8,
        }}
      >
        Undercut / Overcut
      </div>
      <p style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 14, maxWidth: '64ch' }}>
        먼저 피트한 드라이버가 언더컷을, 더 오래 버틴 드라이버가 오버컷을 시도한 상황입니다. 두
        드라이버가 모두 피트를 마친 뒤 순위가 뒤바뀌면 언더컷 성공, 유지되면 오버컷 성공입니다.
      </p>

      {duels.length === 0 ? (
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: MUTED,
            padding: '16px 0',
          }}
        >
          이 레이스에서 감지된 언더컷/오버컷 시도가 없습니다.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {duels.map((duel, i) => (
            <DuelRow
              key={`${duel.undercutterDriverNumber}-${duel.undercutLap}-${i}`}
              duel={duel}
              driverMap={driverMap}
            />
          ))}
        </div>
      )}
    </div>
  )
}
