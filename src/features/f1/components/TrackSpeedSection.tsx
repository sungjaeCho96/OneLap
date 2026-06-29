import TrackSpeedComparison from './TrackSpeedComparison'
import type { QualifyingSessionOption } from '@/features/f1/trackSpeed'

const BG = '#15120D'
const CARD_BG = '#1E1A13'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'
const RED = '#E10600'

const LEGEND = [
  {
    color: '#3b2fb0',
    label: '저속 (파랑)',
    desc: '코너 감속 구간 — 브레이킹 포인트와 코너 진입 속도를 확인할 수 있어요.',
  },
  {
    color: '#2fd27a',
    label: '중속 (녹색)',
    desc: '중간 속도 구간 — 코너 탈출과 짧은 직선에서 나타납니다.',
  },
  {
    color: '#E10600',
    label: '고속 (레드)',
    desc: '최고속 구간 — 긴 직선에서 최대 속도에 도달한 지점입니다.',
  },
]

interface TrackSpeedSectionProps {
  sessions: QualifyingSessionOption[]
}

export default function TrackSpeedSection({ sessions }: TrackSpeedSectionProps) {
  return (
    <section
      id="track-speed"
      style={{
        background: BG,
        color: TEXT,
        borderBottom: `1px solid ${BORDER}`,
        padding: '64px 0',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* 섹션 헤더 */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: RED,
              marginBottom: 12,
            }}
          >
            Qualifying Analysis
          </div>
          <h2
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(28px,4vw,48px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase' as const,
              marginBottom: 14,
            }}
          >
            트랙 속도 비교
          </h2>
          <p style={{ fontSize: 15, color: MUTED, maxWidth: '56ch', lineHeight: 1.65 }}>
            퀄리파잉 패스티스트 랩 데이터를 기반으로 두 드라이버의 트랙 전 구간 속도를 색상으로
            시각화합니다. 코너를 클릭해 해당 지점의 속도·기어·스로틀 데이터를 비교해보세요.
          </p>
        </div>

        {/* 위젯 */}
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, overflow: 'hidden' }}>
          <TrackSpeedComparison sessions={sessions} />
        </div>

        {/* 범례 */}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
            }}
          >
            {LEGEND.map((item) => (
              <div
                key={item.label}
                style={{
                  background: CARD_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 4,
                  padding: '18px 16px',
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: item.color,
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontWeight: 700,
                      fontSize: 12,
                      color: TEXT,
                      marginBottom: 6,
                    }}
                  >
                    {item.label}
                  </div>
                  <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.55 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
