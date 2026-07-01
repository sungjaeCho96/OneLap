import { TYRE_COLORS, TYRE_LABELS } from '@/features/f1/pitStrategy'
import type { TyreCompound } from '@/features/f1/pitStrategy'

const CARD_BG = '#1E1A13'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'
const RED = '#E10600'

const DISPLAY_COMPOUNDS: TyreCompound[] = ['SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET']

const READING_GUIDE = [
  '가로 막대 = 한 드라이버의 레이스 전체. 색이 바뀌는 지점이 피트스톱입니다.',
  '막대 길이 = 해당 타이어로 달린 랩 수.',
  'DNF = 완주하지 못한 드라이버, DNS = 출전하지 않은 드라이버, DSQ = 실격된 드라이버.',
]

export default function PitStrategyLegend() {
  return (
    <div style={{ marginTop: 28 }}>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase' as const,
          color: RED,
          marginBottom: 14,
        }}
      >
        이렇게 읽으세요
      </div>

      {/* Tyre compound chips */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          marginBottom: 16,
        }}
      >
        {DISPLAY_COMPOUNDS.map((compound) => (
          <div
            key={compound}
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: '8px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: TYRE_COLORS[compound],
                flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontWeight: 700,
                fontSize: 11,
                color: TEXT,
                letterSpacing: '0.04em',
              }}
            >
              {TYRE_LABELS[compound]}
            </span>
          </div>
        ))}
      </div>

      {/* Reading guide */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {READING_GUIDE.map((text, i) => (
          <div
            key={i}
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 4,
              padding: '18px 16px',
              fontSize: 13,
              color: MUTED,
              lineHeight: 1.55,
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
