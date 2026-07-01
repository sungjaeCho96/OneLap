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
    color: '#3B82F6',
    label: '드라이버 A 우세',
    desc: '해당 구간에서 드라이버 A가 더 빠릅니다. 선택한 드라이버의 팀 컬러로 표시됩니다.',
  },
  {
    color: '#EF4444',
    label: '드라이버 B 우세',
    desc: '해당 구간에서 드라이버 B가 더 빠릅니다. 선택한 드라이버의 팀 컬러로 표시됩니다.',
  },
  {
    color: '#6B6051',
    label: '동률 구간',
    desc: '두 드라이버의 속도 차이가 3 km/h 미만인 구간입니다. 승부를 가리기 어려운 지점이에요.',
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
            퀄리파잉 패스티스트 랩 데이터를 기반으로 두 드라이버의 속도를 구간마다 비교해,
            더 빠른 드라이버의 팀 컬러로 트랙을 표시합니다. 포인트를 클릭해 해당 지점의
            속도·기어·스로틀 데이터를 확인해보세요.
          </p>
        </div>

        {/* 위젯 */}
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 4, overflow: 'clip' }}>
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
