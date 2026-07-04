import CornerAnalysisWidget from './CornerAnalysisWidget'
import type { RaceSession } from '@/features/f1/pitStrategy'

const BG = '#15120D'
const CARD_BG = '#1E1A13'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'
const RED = '#E10600'

const LEGEND = [
  {
    marker: '◆',
    label: '다이아몬드 = 고속 코너 (에어로)',
    desc: '고속 코너의 apex 속도는 다운포스·에어로 성능을 반영합니다. 에어로 축을 선택하면 색이 진해집니다.',
  },
  {
    marker: '■',
    label: '사각형 = 중속 코너',
    desc: '참고용으로 표시되며, 에어로/기계적그립 어느 결론에도 직접 쓰이지 않습니다.',
  },
  {
    marker: '●',
    label: '원 = 저속 코너 (기계적 그립)',
    desc: '저속 코너의 apex 속도는 기계적 그립·트랙션 성능을 반영합니다. 기계적그립 축을 선택하면 색이 진해집니다.',
  },
  {
    color: '#22C55E',
    label: '초록 = 필드보다 강함',
    desc: '해당 팀이 같은 지점에서 다른 팀들의 중앙값보다 빠릅니다. 빨강은 반대로 필드보다 약하다는 뜻입니다.',
  },
  {
    color: '#4B5563',
    label: '속 빈 회색 마커 = 분석 불가',
    desc: '표본(유효 랩)이 부족해 해당 지점의 값을 계산하지 못했습니다.',
  },
  {
    color: '#857A6A',
    label: '"1인 데이터" 라벨',
    desc: '팀 소속 드라이버 중 한 명의 기록만으로 계산된 값입니다. 참고용으로만 활용하세요.',
  },
]

interface CornerAnalysisSectionProps {
  races: readonly RaceSession[]
}

export default function CornerAnalysisSection({ races }: CornerAnalysisSectionProps) {
  return (
    <section
      id="corner-analysis"
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
            Race Pace
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
            팀별 코너 강점 분석
          </h2>
          <p style={{ fontSize: 15, color: MUTED, maxWidth: '56ch', lineHeight: 1.65 }}>
            같은 레이스에서 각 팀이 어떤 코너와 직선에서 강한지 한눈에 비교합니다. 고속 코너는
            에어로, 저속 코너는 기계적 그립, 직선 구간은 가속 성능을 나타내는 지표로 활용해보세요.
          </p>
        </div>

        {/* 위젯 */}
        <CornerAnalysisWidget races={races} />

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
                {'marker' in item ? (
                  <span style={{ fontSize: 16, color: MUTED, flexShrink: 0, lineHeight: 1 }}>{item.marker}</span>
                ) : (
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
                )}
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
