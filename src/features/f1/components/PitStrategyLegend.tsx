import { TYRE_COLORS, TYRE_LABELS } from '@/features/f1/pitStrategy'
import type { TyreCompound } from '@/features/f1/pitStrategy'

const CARD_BG = '#FFFFFF'
const BORDER = '#E0D9CB'
const TEXT = '#15120D'
const MUTED = '#4A4338'
const RED = '#E10600'

const DISPLAY_COMPOUNDS: TyreCompound[] = ['SOFT', 'MEDIUM', 'HARD', 'INTERMEDIATE', 'WET']

const READING_GUIDE = [
  '가로 막대 = 한 드라이버의 레이스 전체. 색이 바뀌는 지점이 피트스톱입니다.',
  '막대 길이 = 해당 타이어로 달린 랩 수.',
  'DNF = 완주하지 못한 드라이버.',
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
                border: '1px solid #E0D9CB',
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
