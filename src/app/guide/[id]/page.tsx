import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SERIES_GUIDE_MAP } from '@/lib/seriesGuideData'
import { SERIES_MAP, SERIES, buildSchedule } from '@/lib/data'
import { fetchF1Races } from '@/lib/f1Api'
import type { SportId } from '@/types'

export const revalidate = 3600

export async function generateStaticParams() {
  return Object.keys(SERIES_GUIDE_MAP).map((id) => ({ id }))
}

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

export default async function SeriesGuidePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const guide = SERIES_GUIDE_MAP[id]
  const series = SERIES_MAP[id as SportId]

  if (!guide || !series) notFound()

  const f1Races = id === 'f1' ? await fetchF1Races() : []
  const allSchedule = buildSchedule(f1Races)
  const upcomingRaces = allSchedule
    .filter((r) => r.sport === id)
    .slice(0, 3)

  return (
    <div
      className="min-h-screen"
      style={{ background: '#F2EFE8', color: '#15120D', fontFamily: "'Noto Sans KR', sans-serif" }}
    >
      {/* NAV */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(242,239,232,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E0D9CB',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link
              href="/#series"
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                color: '#857A6A',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              ← 홈
            </Link>
            <span style={{ color: '#E0D9CB' }}>|</span>
            <span
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 900,
                fontSize: 20,
                letterSpacing: '-0.02em',
              }}
            >
              OneLap
            </span>
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: '#857A6A',
                letterSpacing: '0.1em',
              }}
            >
              / 종목 가이드
            </span>
          </div>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#fff',
              background: '#15120D',
              padding: '8px 16px',
              borderRadius: 2,
            }}
          >
            초심자 가이드
          </div>
        </div>
      </header>

      {/* SERIES TAB */}
      <div style={{ background: '#15120D', overflowX: 'auto' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            gap: 0,
          }}
        >
          {SERIES.map((s) => {
            const isActive = s.id === id
            const label = s.short
            return (
              <Link
                key={s.id}
                href={`/guide/${s.id}`}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  padding: '16px 22px',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  background: isActive ? s.color : 'transparent',
                  color: isActive ? '#fff' : '#9A9081',
                  borderBottom: `0px solid ${isActive ? s.color : 'transparent'}`,
                  transition: 'all .15s',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>
      </div>

      {/* HERO */}
      <section style={{ background: series.color, color: '#fff', padding: '60px 24px 56px' }}>
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 32,
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(4px)',
                borderRadius: 99,
                padding: '6px 14px',
                marginBottom: 20,
              }}
            >
              <span style={{ fontSize: 16 }}>{guide.emoji}</span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                초심자 환영
              </span>
            </div>
            <h1
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(36px,5.5vw,72px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                marginBottom: 16,
                wordBreak: 'break-word',
              }}
            >
              {series.name}
            </h1>
            <div
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(20px,2.5vw,26px)',
                lineHeight: 1.3,
                opacity: 0.92,
                maxWidth: 640,
              }}
            >
              {guide.tagline}
            </div>
          </div>
          <div
            style={{
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              borderRadius: 4,
              padding: '20px 24px',
              minWidth: 200,
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                opacity: 0.75,
                marginBottom: 10,
              }}
            >
              한눈에 보는 숫자
            </div>
            {guide.quickStats.map((st) => (
              <div
                key={st.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  gap: 16,
                  padding: '7px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <span style={{ fontSize: 13, opacity: 0.85 }}>{st.label}</span>
                <span
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 900,
                    fontSize: 18,
                  }}
                >
                  {st.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ONE LINE */}
      <section style={{ background: '#15120D', padding: '40px 24px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto', textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#857A6A',
              marginBottom: 14,
            }}
          >
            한 줄 요약
          </div>
          <p
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 700,
              fontSize: 'clamp(22px,3.5vw,34px)',
              lineHeight: 1.3,
              color: '#F2EFE8',
              letterSpacing: '-0.01em',
            }}
          >
            &ldquo;{guide.oneLiner}&rdquo;
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '72px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 48,
        }}
      >
        <div style={{ flex: '1 1 480px', minWidth: 300 }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#857A6A',
              marginBottom: 16,
            }}
          >
            어떤 스포츠인가요?
          </div>
          <h2
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(28px,3.5vw,42px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}
          >
            {guide.introTitle}
          </h2>
          {guide.introParas.map((para, i) => (
            <p
              key={i}
              style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', marginBottom: 16 }}
            >
              {para}
            </p>
          ))}
        </div>
        <div
          style={{
            flex: '1 1 320px',
            minWidth: 260,
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#857A6A',
              marginBottom: 4,
            }}
          >
            이것만 알면 OK
          </div>
          {guide.bullets.map((b) => (
            <div
              key={b.title}
              style={{
                display: 'flex',
                gap: 14,
                alignItems: 'flex-start',
                background: '#fff',
                borderRadius: 4,
                padding: '16px 18px',
                borderLeft: `4px solid ${series.color}`,
              }}
            >
              <span style={{ fontSize: 22, flex: 'none', lineHeight: 1 }}>{b.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{b.title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: '#4A4338' }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GLOSSARY */}
      <section
        style={{
          background: '#EAE5DA',
          padding: '72px 0',
          borderTop: '1px solid #E0D9CB',
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 12,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#857A6A',
              marginBottom: 12,
            }}
          >
            용어집
          </div>
          <h2
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(28px,4vw,48px)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            이 단어만 알면<br />경기가 두 배 재밌어요
          </h2>
          <p style={{ fontSize: 16, color: '#4A4338', marginBottom: 40 }}>
            처음엔 낯설어도 괜찮아요. 한 번 보면 금방 익숙해집니다.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 16,
            }}
          >
            {guide.glossary.map((g) => (
              <div
                key={g.term}
                style={{
                  background: '#fff',
                  borderRadius: 4,
                  padding: '22px 22px 20px',
                  borderTop: `3px solid ${series.color}`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{g.icon}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Archivo', sans-serif",
                        fontWeight: 800,
                        fontSize: 17,
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {g.term}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 10,
                        color: '#857A6A',
                        letterSpacing: '0.06em',
                        marginTop: 2,
                      }}
                    >
                      {g.eng}
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: '#3A352C' }}>{g.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WATCH GUIDE + FAQ */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 48 }}>
          <div style={{ flex: '1 1 420px', minWidth: 280 }}>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#857A6A',
                marginBottom: 12,
              }}
            >
              시청 가이드
            </div>
            <h2
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(28px,4vw,48px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                marginBottom: 28,
              }}
            >
              처음이라면<br />이것만 봐요
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {guide.watchTips.map((tip) => (
                <div key={tip.num} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      background: series.color,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flex: 'none',
                      color: '#fff',
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    {tip.num}
                  </div>
                  <div style={{ paddingTop: 6 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{tip.title}</div>
                    <div style={{ fontSize: 14, lineHeight: 1.6, color: '#4A4338' }}>{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: '1 1 320px', minWidth: 260 }}>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 12,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#857A6A',
                marginBottom: 12,
              }}
            >
              자주 묻는 질문
            </div>
            <h2
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(28px,4vw,48px)',
                lineHeight: 0.95,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                marginBottom: 28,
              }}
            >
              궁금한 거<br />다 모았어요
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {guide.faq.map((q) => (
                <div
                  key={q.question}
                  style={{
                    background: '#fff',
                    borderRadius: 4,
                    padding: '18px 20px',
                    borderLeft: `4px solid ${series.color}`,
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, lineHeight: 1.3 }}>
                    {q.question}
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.65, color: '#4A4338' }}>{q.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING RACES */}
      {upcomingRaces.length > 0 && (
        <section style={{ background: '#15120D', color: '#F2EFE8', padding: '64px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 16,
                marginBottom: 32,
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: 12,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: series.color,
                    marginBottom: 12,
                  }}
                >
                  이번 시즌 일정
                </div>
                <h2
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 900,
                    fontSize: 'clamp(28px,4vw,48px)',
                    lineHeight: 0.95,
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                  }}
                >
                  다음 경기 미리보기
                </h2>
              </div>
              <Link
                href="/#schedule"
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#C9C1B2',
                  textDecoration: 'none',
                  borderBottom: '2px solid #C9C1B2',
                  paddingBottom: 4,
                }}
              >
                전체 일정 보기 →
              </Link>
            </div>
            <div style={{ borderTop: '1px solid #2C271F' }}>
              {upcomingRaces.map((r) => {
                const d = new Date(r.date)
                return (
                  <div
                    key={`${r.round}-${r.name}`}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 20,
                      padding: '22px 8px',
                      borderBottom: '1px solid #2C271F',
                    }}
                  >
                    <div
                      style={{
                        width: 5,
                        alignSelf: 'stretch',
                        background: series.color,
                        minHeight: 48,
                        flex: 'none',
                      }}
                    />
                    <div style={{ flex: 'none', width: 72, textAlign: 'center' }}>
                      <div
                        style={{
                          fontFamily: "'Archivo', sans-serif",
                          fontWeight: 900,
                          fontSize: 30,
                          lineHeight: 0.9,
                        }}
                      >
                        {String(d.getDate()).padStart(2, '0')}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 11,
                          color: '#9A9081',
                          letterSpacing: '0.08em',
                          marginTop: 4,
                        }}
                      >
                        {MONTHS[d.getMonth()]}
                      </div>
                    </div>
                    <div style={{ flex: '1 1 240px', minWidth: 180 }}>
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 11,
                          color: '#857A6A',
                          letterSpacing: '0.08em',
                          marginBottom: 5,
                        }}
                      >
                        ROUND {r.round}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Archivo', sans-serif",
                          fontWeight: 800,
                          fontSize: 20,
                          lineHeight: 1.1,
                          textTransform: 'uppercase',
                        }}
                      >
                        {r.name}
                      </div>
                    </div>
                    <div style={{ flex: '1 1 160px', minWidth: 130 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.circuit}</div>
                      <div
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 12,
                          color: '#9A9081',
                          marginTop: 3,
                        }}
                      >
                        {r.loc}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER CTA */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>{guide.emoji}</div>
        <h2
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(28px,4vw,48px)',
            lineHeight: 1.0,
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}
        >
          이제 경기가 기대되지 않으신가요?
        </h2>
        <p style={{ fontSize: 16, color: '#4A4338', marginBottom: 32 }}>
          OneLap과 함께, 첫 경기를 최대한 즐겨보세요.
        </p>
        <Link
          href="/#schedule"
          style={{
            display: 'inline-block',
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            color: '#fff',
            background: series.color,
            padding: '14px 32px',
            borderRadius: 2,
          }}
        >
          다음 경기 일정 확인 →
        </Link>
      </section>
    </div>
  )
}
