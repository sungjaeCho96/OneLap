'use client'

interface TooltipRow {
  code: string
  color: string
  speed: number
  gear: number
}

interface SpeedTooltipProps {
  leftPct: number
  topPct: number
  rowA: TooltipRow
  rowB: TooltipRow
}

function Row({ code, color, speed, gear }: TooltipRow) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: 12 }}>
      <span style={{ color, fontWeight: 700, width: 34, fontFamily: "'Space Mono', monospace" }}>
        {code}
      </span>
      <span style={{ color: '#F5F0E8', fontWeight: 700, fontFamily: "'Space Mono', monospace" }}>
        {speed}
        <span style={{ fontSize: 9, color: '#857A6A' }}> km/h</span>
      </span>
      <span style={{ color: '#857A6A', fontSize: 10, fontFamily: "'Space Mono', monospace" }}>
        G{gear}
      </span>
    </div>
  )
}

export default function SpeedTooltip({ leftPct, topPct, rowA, rowB }: SpeedTooltipProps) {
  const flipX = leftPct > 60
  const flipY = topPct < 18

  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: `translate(${flipX ? 'calc(-100% - 12px)' : '12px'}, ${flipY ? '12px' : 'calc(-100% - 12px)'})`,
        zIndex: 20,
        pointerEvents: 'none',
        background: '#15120D',
        border: '1px solid #2C271F',
        borderRadius: 4,
        padding: '8px 10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
      }}
    >
      <div
        style={{
          fontSize: 9,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#857A6A',
          marginBottom: 4,
          fontFamily: "'Space Mono', monospace",
        }}
      >
        속도 / 기어
      </div>
      <Row {...rowA} />
      <Row {...rowB} />
    </div>
  )
}
