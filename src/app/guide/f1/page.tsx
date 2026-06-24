import type { ReactNode } from 'react'
import Link from 'next/link'
import { SERIES, buildSchedule } from '@/lib/data'
import { fetchF1Races, fetchF1DriverStandings } from '@/lib/f1Api'
import TimingTower from './TimingTower'
import TireSimulator from './TireSimulator'
import FlagQuiz from './FlagQuiz'
import TeamShowcase from './TeamShowcase'
import DriverGallery from './DriverGallery'

export const revalidate = 3600

const RED = '#E10600'
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function SecHead({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: RED, border: '1px solid #E0D9CB', borderRadius: 2, padding: '4px 9px' }}>
          {num}
        </span>
        <h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 900, fontSize: 'clamp(22px,3.4vw,34px)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
          {title}
        </h2>
      </div>
      <p style={{ fontSize: 15, color: '#857A6A', maxWidth: '60ch', lineHeight: 1.6 }}>{sub}</p>
    </div>
  )
}

function Hl({ children }: { children: ReactNode }) {
  return <span style={{ fontWeight: 700, color: '#15120D' }}>{children}</span>
}


export default async function F1GuidePage() {
  const [f1Races, standings] = await Promise.all([fetchF1Races(), fetchF1DriverStandings()])
  const schedule = buildSchedule(f1Races)
  const upcomingRaces = schedule.filter((r) => r.sport === 'f1').slice(0, 3)

  return (
    <div style={{ background: '#F2EFE8', color: '#15120D', fontFamily: "'Noto Sans KR', sans-serif", minHeight: '100vh' }}>

      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(242,239,232,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/#series" style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#857A6A', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>← 홈</Link>
            <span style={{ color: '#E0D9CB' }}>|</span>
            <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 20, letterSpacing: '-0.02em' }}>OneLap</span>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', letterSpacing: '0.1em' }}>/ 종목 가이드</span>
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#fff', background: '#15120D', padding: '8px 16px', borderRadius: 2 }}>초심자 가이드</div>
        </div>
      </header>

      {/* SERIES TABS */}
      <div style={{ background: '#15120D', overflowX: 'auto' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex' }}>
          {SERIES.filter((s) => ['f1', 'wec'].includes(s.id)).map((s) => {
            const isActive = s.id === 'f1'
            return (
              <Link key={s.id} href={`/guide/${s.id}`} style={{
                fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', padding: '16px 22px', whiteSpace: 'nowrap',
                background: isActive ? s.color : 'transparent', color: isActive ? '#fff' : '#9A9081',
                textDecoration: 'none', display: 'block',
                borderBottom: isActive ? `3px solid ${s.color}` : '3px solid transparent',
                transition: 'all .15s',
              }}>{s.short}</Link>
            )
          })}
        </div>
      </div>

      {/* HERO */}
      <section style={{ background: RED, padding: '60px 24px 56px', overflow: 'hidden', position: 'relative', minHeight: 420 }}>
        {/* 베르스타펜 이미지 */}
        <img
          src="/images/f1/Max-Verstappen-Hero-Section.webp"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute', left: '50%', bottom: -70,
            transform: 'translateX(-50%)',
            height: '115%', width: 'auto',
            objectFit: 'contain', objectPosition: 'bottom center',
            pointerEvents: 'none', userSelect: 'none',
            maskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)',
            opacity: 0.65,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(900px 380px at 80% -10%, rgba(0,0,0,.22), transparent 60%), radial-gradient(700px 340px at 10% 120%, rgba(0,0,0,.18), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>

          {/* 텍스트 */}
          <div style={{ flex: '1 1 380px', color: '#fff' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '6px 14px', marginBottom: 18 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>초심자 환영</span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 10 }}>Formula 1 · 입문 가이드</div>
            <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(48px,7vw,80px)', lineHeight: 0.9, letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: 10 }}>READY?</h1>
            <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 900, fontSize: 'clamp(20px,3.5vw,38px)', lineHeight: 1.1, opacity: 0.9, marginBottom: 22 }}>규칙을 몰라도<br />레이스는 보입니다</div>
            <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.88, maxWidth: '42ch' }}>
              F1을 한 번도 안 본 사람을 위한 안내서. <strong style={{ fontWeight: 700 }}>차 한 대가 왜 빠른지</strong>부터, 중계 화면 구석의 <strong style={{ fontWeight: 700 }}>이 타이밍 보드를 읽는 법</strong>까지 — 순서대로 따라오면 다음 경기부터 다르게 보여요.
            </p>
          </div>

          {/* 라이브 타이밍 보드 */}
          <div style={{ flex: '1 1 300px', maxWidth: 440 }}>
            <TimingTower standings={standings} />
          </div>
        </div>
      </section>

      {/* WHY HOOK */}
      <section style={{ padding: '80px 0 72px', borderBottom: '1px solid #E0D9CB', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', maxWidth: '52ch', margin: '0 auto 52px' }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: RED, marginBottom: 14 }}>왜 빠져드는가</div>
            <h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 900, fontSize: 'clamp(26px,3.8vw,40px)', lineHeight: 1.15, letterSpacing: '-0.01em', marginBottom: 14 }}>
              한 번 보면 끊기 어렵습니다.<br />이유가 세 가지 있어요.
            </h2>
            <p style={{ color: '#857A6A', fontSize: 16, lineHeight: 1.65 }}>속도 때문만이 아니에요. 사람, 전략, 그리고 그 순간 — 세 가지가 겹치는 스포츠가 F1입니다.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
            {([
              {
                c: RED, num: '01', icon: '🎭', title: '사람 이야기가 있다',
                moment: '"팀메이트가 가장 위험한 적이 된다."',
                desc: <>같은 차, 같은 타이어, 같은 데이터 — 그런데 왜 한 명은 이기고 한 명은 진걸까. <strong>22명 각자의 야망과 균열</strong>이 90분 안에 드러납니다. 챔피언의 몰락, 신인의 반란, 동료 간의 갈등. F1엔 드라마 작가가 따로 없어요.</>,
              },
              {
                c: '#b45cff', num: '02', icon: '🧠', title: '알면 알수록 더 보인다',
                moment: '"피트스톱 2초가 순위를 뒤집는다."',
                desc: <>경기 중반, 아무 일도 없어 보이는 순간 — 사실 팀은 <strong>타이어, 연료, 간격, 날씨</strong>를 모두 계산하고 있어요. 세이프티카 하나에 판이 뒤집히고, 언더컷 전략 하나가 챔피언십을 바꿉니다. 규칙을 조금씩 알게 될수록 화면이 다르게 읽혀요.</>,
              },
              {
                c: '#f4c13b', num: '03', icon: '⚡', title: '보는 것만으로 압도된다',
                moment: '"시속 320km에서 브레이크를 밟는 순간."',
                desc: <>모나코의 야간 예선, 빗속에서 물보라를 가르는 웻 레이스, 피트레인에서 새 타이어를 신고 튀어나오는 차 — <strong>설명 없이도 심장이 반응하는 장면</strong>들이 있어요. F1은 눈으로 먼저 빠져드는 스포츠입니다.</>,
              },
            ] as { c: string; num: string; icon: string; title: string; moment: string; desc: ReactNode }[]).map((card, i, arr) => (
              <div key={card.num} style={{
                padding: '38px 30px 34px', background: '#fff',
                borderRadius: i === 0 ? '4px 0 0 4px' : i === arr.length - 1 ? '0 4px 4px 0' : 0,
                borderTop: `3px solid ${card.c}`,
              }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', color: card.c, opacity: 0.7, marginBottom: 16 }}>{card.num}</div>
                <div style={{ fontSize: 28, marginBottom: 18 }}>{card.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10, lineHeight: 1.2 }}>{card.title}</h3>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, color: card.c, fontSize: 14, lineHeight: 1.45, marginBottom: 14 }}>{card.moment}</div>
                <p style={{ color: '#4A4338', fontSize: 14, fontWeight: 400, lineHeight: 1.65 }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01. F1, 한 줄로 말하면 */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="01" title="F1, 한 줄로 말하면" sub="세계에서 가장 빠른 자동차 경주. 한 시즌 동안 전 세계를 돌며 우승을 다투는 챔피언십입니다." />
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch' }}>
            F1은 <Hl>오픈휠</Hl>(바퀴가 차체 밖으로 드러난) 경주차로 겨루는 모터스포츠의 최고 무대예요.<br></br> 차 한 대가 시속 300km를 넘나들고, 순위는 <Hl>0.001초</Hl> 단위로 갈립니다. <br></br>하지만 F1의 진짜 재미는 속도만이 아니라 <Hl>팀과 팀의 전략 싸움</Hl>에 있어요<br></br>언제 타이어를 갈지, 언제 추월을 시도할지의 두뇌 게임이죠.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch', marginTop: 14 }}>
            한 시즌은 여러 나라에서 열리는 경주(그랑프리)의 모음이고, <br></br>매 경주에서 쌓은 점수로 연말 챔피언을 가립니다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 32 }}>
            {[
              { big: '11', lab: '참가 팀 (컨스트럭터)', note: '2026 · Cadillac 합류로 +1' },
              { big: '22', lab: '드라이버 (팀당 2명)', note: '2026 시즌 기준' },
              { big: '22', lab: '그랑프리 (3월~12월)', note: '원래 24경기 → 2경기 취소' },
            ].map((s) => (
              <div key={s.lab} style={{ background: '#fff', borderLeft: `3px solid ${RED}`, borderRadius: 4, padding: '22px 20px' }}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 44, lineHeight: 1 }}>{s.big}</div>
                <div style={{ fontSize: 14, color: '#4A4338', marginTop: 8 }}>{s.lab}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A', marginTop: 4 }}>{s.note}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 22, display: 'flex', gap: 16, alignItems: 'flex-start', background: 'rgba(244,193,59,.06)', border: '1px solid rgba(244,193,59,.3)', borderRadius: 4, padding: '18px 20px' }}>
            <div style={{ flexShrink: 0, fontSize: 18, marginTop: 2, color: '#E8842B' }}>⚠</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#E8842B', marginBottom: 7 }}>2026 시즌 특이사항 — 바레인 · 사우디아라비아 GP 취소</div>
              <p style={{ fontSize: 14, color: '#4A4338', lineHeight: 1.7 }}>
                2026년 2월 말 중동 전쟁이 발발하면서 바레인과 사우디아라비아가 분쟁 지역에 포함됐습니다. F1은 선수단 안전을 이유로 <strong>3월 14일 두 경기의 공식 취소</strong>를 발표했어요. 4라운드(바레인, 4/12)와 5라운드(사우디아라비아, 4/19)가 모두 빠지면서 원래 <strong>24경기였던 시즌이 22경기로 축소</strong>됐고, 일본 GP 이후 다음 경기인 마이애미 GP까지 <strong>5주 공백</strong>이 생겼습니다. 취소된 두 경기는 다른 일정으로 대체되지 않았어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02. 누가 경쟁하나 */}
      <section style={{ padding: '72px 0', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="02" title="누가 경쟁하나 — 팀과 드라이버" sub="F1엔 우승 트로피가 두 개 있습니다. 이걸 알면 순위표가 단번에 이해돼요." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 22 }}>
            {[
              { title: '드라이버', tag: '개인전', body: <p style={{ fontSize: 14, lineHeight: 1.65, color: '#4A4338' }}>22 명의 드라이버가 각자 점수를 모아 <Hl>월드 드라이버 챔피언</Hl>을 노립니다. 우리가 흔히 &quot;올해 챔피언&quot;이라 부르는 게 보통 이쪽이에요.</p> },
              { title: '컨스트럭터(팀)', tag: '단체전', body: <p style={{ fontSize: 14, lineHeight: 1.65, color: '#4A4338' }}>팀은 곧 <Hl>&apos;컨스트럭터&apos;</Hl>(차를 만드는 주체). 소속 두 드라이버의 점수를 합쳐 <Hl>팀 챔피언</Hl>을 다툽니다. 상금과 직결돼 팀에겐 이쪽이 더 중요하기도 해요.</p> },
            ].map((card) => (
              <div key={card.title} style={{ background: '#fff', border: '1px solid #E0D9CB', borderRadius: 4, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 17 }}>{card.title}</h3>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: RED, border: '1px solid #E0D9CB', padding: '2px 6px', borderRadius: 2, fontWeight: 700 }}>{card.tag}</span>
                </div>
                {card.body}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch' }}>
            즉 한 드라이버가 결승선을 통과할 때, <Hl>자신을 위한 점수</Hl>와 <Hl>팀을 위한 점수</Hl>를 동시에 버는 셈이에요. 같은 팀 동료끼리도 라이벌이 되는 이유죠.
          </p>
        </div>
      </section>

      {/* 02-B. 2026 그리드 — 11개 팀 */}
      <section style={{ padding: '0 0 72px', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ paddingTop: 64, marginBottom: 4 }}>
            <SecHead
              num="02-B"
              title="2026 그리드 — 11개 팀 둘러보기"
              sub="로고를 눌러 각 팀의 드라이버와 특징, 초심자 관전 포인트를 확인하세요. 응원할 팀을 하나 정하면 레이스가 훨씬 재밌어집니다."
            />
          </div>
          <TeamShowcase />
        </div>
      </section>

      {/* 02-C. 드라이버 라인업 */}
      <section style={{ padding: '0 0 72px', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ paddingTop: 64, marginBottom: 4 }}>
            <SecHead
              num="02-C"
              title="2026 드라이버 라인업"
              sub="11개 팀, 22명의 드라이버. 팀마다 두 명씩 — 같은 차를 타는 팀메이트가 서로의 가장 가까운 라이벌이기도 합니다."
            />
          </div>
          <DriverGallery />
        </div>
      </section>

      {/* 03. 레이스 주말 */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="03" title="레이스 주말은 이렇게 흘러갑니다" sub="하루짜리 이벤트가 아니에요. 보통 3일에 걸쳐 단계가 쌓입니다." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {([
              { phase: 'Practice', title: '연습 주행', desc: '팀이 차를 세팅하고 타이어·코스에 적응하는 시간. 순위에 직접 영향은 없지만 누가 빠른지 힌트를 줍니다.', arrow: true },
              { phase: 'Qualifying', title: '예선', desc: <>가장 빠른 한 바퀴로 결승 <Hl>출발 순서(그리드)</Hl>를 정합니다. Q1·Q2·Q3로 갈수록 느린 차가 탈락. 1위가 <Hl>폴 포지션</Hl>.</>, arrow: true },
              { phase: 'Race', title: '결승', desc: '본 경기. 정해진 바퀴 수를 가장 먼저 완주하면 우승. 상위 10위까지 점수를 받습니다.', arrow: false },
            ] as { phase: string; title: string; desc: ReactNode; arrow: boolean }[]).map((step, i) => (
              <div key={step.phase} style={{ background: '#fff', padding: '24px 22px', border: '1px solid #E0D9CB', borderRight: i < 2 ? 'none' : '1px solid #E0D9CB', borderRadius: i === 0 ? '4px 0 0 4px' : i === 2 ? '0 4px 4px 0' : 0, position: 'relative' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: RED, textTransform: 'uppercase', marginBottom: 8 }}>{step.phase}</div>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>{step.title}</h4>
                <p style={{ fontSize: 14, color: '#4A4338', lineHeight: 1.6 }}>{step.desc}</p>
                {step.arrow && (
                  <div style={{ position: 'absolute', right: -11, top: '50%', transform: 'translateY(-50%)', zIndex: 2, width: 22, height: 22, borderRadius: '50%', background: '#EAE5DA', border: '1px solid #E0D9CB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: RED, fontSize: 11 }}>→</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, background: 'rgba(232,132,43,0.07)', border: '1px solid rgba(232,132,43,0.28)', borderRadius: 4, padding: '16px 18px', fontSize: 14, color: '#3A352C', lineHeight: 1.65 }}>
            <strong style={{ color: '#E8842B' }}>스프린트 주말</strong>이라는 변형도 있어요(시즌에 몇 번). 짧은 거리의 <strong style={{ color: '#E8842B' }}>스프린트 레이스</strong>가 추가돼 별도 점수까지 걸리는, 주말 내내 긴장감이 높은 포맷입니다.
          </div>
        </div>
      </section>

      {/* 04. 점수 */}
      <section style={{ padding: '72px 0', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="04" title="점수는 어떻게 매겨지나" sub="결승에서 상위 10위까지만 점수를 받습니다. 1등과 2등의 차이가 꽤 크죠." />
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: '#857A6A', marginBottom: 10 }}>A. 레이스 - 그랑프리의 본 경기</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6, marginBottom: 15 }}>
            {[
              { pos: 'P1',  pts: 25, valueColor: '#D4A017', borderColor: 'rgba(244,193,59,.5)' },
              { pos: 'P2',  pts: 18, valueColor: '#888' },
              { pos: 'P3',  pts: 15, valueColor: '#C87941' },
              { pos: 'P4',  pts: 12 },
              { pos: 'P5',  pts: 10 },
              { pos: 'P6',  pts: 8  },
              { pos: 'P7',  pts: 6  },
              { pos: 'P8',  pts: 4  },
              { pos: 'P9',  pts: 2  },
              { pos: 'P10', pts: 1  },
            ].map((p) => (
              <div key={p.pos} style={{ background: '#fff', border: `1px solid ${p.borderColor ?? '#E0D9CB'}`, borderRadius: 4, padding: '14px 6px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A' }}>{p.pos}</div>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 22, marginTop: 4, color: p.valueColor ?? '#15120D' }}>{p.pts}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: '#857A6A', marginBottom: 10 }}>B. 스프린트 레이스 - 미니 레이스</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 6, marginBottom: 15 }}>
            {[
              { pos: 'P1',  pts: 8, valueColor: '#D4A017', borderColor: 'rgba(244,193,59,.5)' },
              { pos: 'P2',  pts: 7, valueColor: '#888' },
              { pos: 'P3',  pts: 6, valueColor: '#C87941' },
              { pos: 'P4',  pts: 5 },
              { pos: 'P5',  pts: 4 },
              { pos: 'P6',  pts: 3  },
              { pos: 'P7',  pts: 2  },
              { pos: 'P8',  pts: 1  },
            ].map((p) => (
              <div key={p.pos} style={{ background: '#fff', border: `1px solid ${p.borderColor ?? '#E0D9CB'}`, borderRadius: 4, padding: '14px 6px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A' }}>{p.pos}</div>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 22, marginTop: 4, color: p.valueColor ?? '#15120D' }}>{p.pts}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch', marginTop: 22 }}>
            11위부터는 점수가 없습니다(<Hl>노 포인트</Hl>). 스프린트 레이스에서는 별도로 <Hl>8위까지</Hl> 8·7·6·5·4·3·2·1점이 주어져요. 이 점수들이 시즌 내내 쌓여 두 챔피언십의 순위가 결정됩니다.
          </p>
        </div>
      </section>

      {/* 05. 타이어 */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="05" title="타이어 — 전략의 핵심" sub="F1의 승부는 타이어에서 갈립니다. 종류만 알아도 피트스톱 전략이 보여요." />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 14 }}>
            {[
              { c: '#ff2e55', abbr: 'S', nm: '소프트',  en: 'SOFT',   ds: '가장 빠르지만 가장 빨리 닳음' },
              { c: '#f4c13b', abbr: 'M', nm: '미디엄',  en: 'MEDIUM', ds: '속도와 내구의 균형' },
              { c: '#aaaaaa', abbr: 'H', nm: '하드',    en: 'HARD',   ds: '느리지만 가장 오래 감' },
              { c: '#2fd27a', abbr: 'I', nm: '인터',    en: 'INTER',  ds: '젖은 노면용' },
              { c: '#3aa0ff', abbr: 'W', nm: '웻',      en: 'WET',    ds: '폭우·물웅덩이용' },
            ].map((t) => (
              <div key={t.abbr} style={{ background: '#fff', border: '1px solid #E0D9CB', borderRadius: 4, padding: '18px 14px', textAlign: 'center' }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', margin: '0 auto 12px', background: '#F2EFE8', border: `4px solid ${t.c}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 14, color: t.c }}>{t.abbr}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{t.nm}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', letterSpacing: '0.08em', marginTop: 2 }}>{t.en}</div>
                <div style={{ fontSize: 12, color: '#4A4338', marginTop: 8, lineHeight: 1.5 }}>{t.ds}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch', marginTop: 18 }}>
            건조한 레이스에서는 <Hl>최소 두 종류</Hl>의 타이어를 써야 해서, 모두가 한 번 이상 피트에 들어옵니다.<br></br>&quot;빠른 타이어로 짧게 vs 오래가는 타이어로 길게&quot; — 이 선택이 승부를 가르죠.
          </p>
          <TireSimulator />
        </div>
      </section>

      {/* 06. 레이스를 바꾸는 네 가지 */}
      <section style={{ padding: '72px 0', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="06" title="레이스를 바꾸는 네 가지" sub="중계에서 가장 자주 나오는 개념 — 추월, 피트스톱, 세이프티카, 더티 에어." />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {([
              { title: '추월 보조', tag: '2026 신규', body: <>예전의 <Hl>DRS</Hl>는 2026년부터 사라졌어요. 대신 직선에서 날개를 눕혀 공기저항을 줄이는 <Hl>액티브 에어로</Hl>와, 앞차에 <Hl>1초 이내</Hl>로 붙으면 전기 동력을 더 쏟아붓는 <Hl>오버테이크 모드</Hl>로 추월을 돕습니다.</> },
              { title: '피트스톱',  tag: '≈ 2초',   body: <>타이어를 갈러 정비 구역에 들어오는 것. 숙련된 팀은 <Hl>2초대</Hl>에 끝냅니다. 상대보다 먼저 들어와 새 타이어로 앞서는 <Hl>언더컷</Hl> 같은 전략이 여기서 나와요.</> },
              { title: '세이프티카', tag: 'SC',       body: <>사고나 위험이 생기면 안전차가 코스에 나와 모두의 속도를 통제합니다. 벌어졌던 간격이 <Hl>한꺼번에 좁혀져</Hl> 경기 양상이 뒤집히곤 하죠.</> },
              { title: '더티 에어',  tag: 'Dirty Air', body: <>앞차가 만든 <Hl>난기류</Hl>. 바로 뒤를 따라가면 차가 불안정해져 추월이 어려워집니다. F1 배틀이 쉽지 않은 핵심 이유예요.</> },
            ] as { title: string; tag: string; body: ReactNode }[]).map((card) => (
              <div key={card.title} style={{ background: '#fff', border: '1px solid #E0D9CB', borderRadius: 4, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 17 }}>{card.title}</h3>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: RED, border: '1px solid #E0D9CB', padding: '2px 6px', borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap' }}>{card.tag}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: '#4A4338' }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07. Flag 가 뭐에요? */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="07" title="플래그 읽기" sub="코스 곳곳에서 플래그로 신호를 줍니다. F1에서 쓰이는 플래그는 모두 11가지예요." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {[
              { bg: '#2fd27a', title: 'Green Flag', desc: '위험 해제 — 정상 주행·추월 가능. 세션 시작 신호로도 쓰임.' },
              { bg: '#f4c13b', title: 'Yellow Flag', desc: '전방 위험 — 속도를 줄이고 추월 금지.' },
              { bg: '', title: 'Double Yellow Flag', desc: '즉각 감속·추월 절대 금지 — 정지 준비. Yellow Flag보다 훨씬 위험한 상황(코스에 마샬이 있을 때).' },
              { bg: '#ff2e55', title: 'Red Flag', desc: '세션 중단 — 모두 즉시 피트로 복귀.' },
              { bg: '#3aa0ff', title: 'Blue Flag', desc: '선두권 차량 접근 — 랩 다운 드라이버는 길을 비켜야 함.' },
              { bg: '#1a1a1a', title: 'Black Flag', desc: '실격 또는 피트 복귀 명령 — 해당 드라이버에게만 제시.' },
              { bg: '#f0f0f0', title: 'White Flag', desc: '코스 위에 느린 차량(의료·안전) 존재 — 주의 요망.' },
              { bg: 'linear-gradient(135deg, #1a1a1a 0 50%, #fff 50% 100%)', title: 'Black And   White Flag', desc: '비신사적 행위 경고 — 옐로카드 개념. 반복 시 Black Flag로 이어질 수 있음.' },
              { bg: 'repeating-linear-gradient(90deg, #f4c13b 0px, #f4c13b 5px, #ff2e55 5px, #ff2e55 9px)', title: 'Yellow Flag With Red Striped', desc: '노면 변화 경고 — 기름·물·잔해로 미끄러울 수 있음.' },
              { bg: 'radial-gradient(circle at 50% 50%, #ff8c00 0% 30%, #1a1a1a 30% 100%)', title: 'Black Flag With An Orange Disc', desc: '차량 기계 결함 경고 — 해당 드라이버는 즉시 피트로 복귀.' },
              { bg: 'conic-gradient(#000 0 25%,#fff 0 50%,#000 0 75%,#fff 0)', title: 'Chequered Flag', desc: '세션 종료 — 결승에서 이걸 받으면 그 바퀴로 경기 끝.' },
            ].map((f) => (
              <div key={f.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', background: '#fff', border: '1px solid #E0D9CB', borderRadius: 4, padding: '16px 18px' }}>
                {f.title === 'Double Yellow Flag' ? (
                  <div style={{ position: 'relative', width: 38, height: 28, flexShrink: 0, marginTop: 3 }}>
                    <div style={{ position: 'absolute', top: 4, left: 4, width: 34, height: 24, background: '#d4a012', borderRadius: 3, border: '1px solid rgba(0,0,0,.08)' }} />
                    <div style={{ position: 'absolute', top: 0, left: 0, width: 34, height: 24, background: '#f4c13b', borderRadius: 3, border: '1px solid rgba(0,0,0,.08)' }} />
                  </div>
                ) : (
                  <div style={{ width: 34, height: 24, borderRadius: 3, flexShrink: 0, marginTop: 3, background: f.bg, border: '1px solid rgba(0,0,0,.08)' }} />
                )}
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: 15 }}>{f.title}</h4>
                  <p style={{ fontSize: 13, color: '#4A4338', marginTop: 3, lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07-B. 플래그 퀴즈 */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '0 0 72px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ paddingTop: 48, marginBottom: 4 }}>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: RED, marginBottom: 8 }}>
              실력 확인
            </div>
            <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 900, fontSize: 'clamp(18px,2.4vw,24px)', lineHeight: 1.2 }}>
              플래그 퀴즈 — 방금 배운 걸 확인해보세요
            </h3>
          </div>
          <FlagQuiz />
        </div>
      </section>

      {/* 08. 용어집 */}
      <section style={{ padding: '72px 0', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="08" title="중계에서 자주 듣는 말" sub="이 단어들만 익혀두면 해설이 훨씬 잘 들립니다." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 36px' }}>
            {[
              { kr: '폴 포지션',    en: 'Pole',          def: '예선 1위. 결승 맨 앞에서 출발하는 자리.' },
              { kr: '포디움',       en: 'Podium',         def: '상위 3위까지 오르는 시상대. "포디움에 섰다" = 3위 안.' },
              { kr: '그리드',       en: 'Grid',           def: '결승 출발 대형. 예선 결과로 자리가 정해짐.' },
              { kr: '박스, 박스',   en: 'Box',            def: '"피트로 들어와라"라는 팀 무전 신호.' },
              { kr: '언더컷',       en: 'Undercut',       def: '상대보다 먼저 새 타이어로 갈아 앞서는 전략.' },
              { kr: '패스티스트 랩', en: 'Fastest Lap',   def: '그 경기에서 가장 빠른 한 바퀴 기록.' },
              { kr: '포메이션 랩',  en: 'Formation Lap',  def: '출발 직전, 대형을 갖추며 도는 준비 바퀴.' },
              { kr: '라이트 아웃',  en: 'Lights Out',     def: '출발 신호등이 모두 꺼지는 순간 = 레이스 시작!' },
            ].map((t) => (
              <div key={t.kr} style={{ padding: '16px 0', borderBottom: '1px solid #E0D9CB' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontWeight: 700, fontSize: 15, marginBottom: 5 }}>
                  {t.kr}
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: RED, fontWeight: 500 }}>{t.en}</span>
                </div>
                <p style={{ fontSize: 14, color: '#4A4338', lineHeight: 1.6 }}>{t.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09. 처음 볼 때 */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="09" title="처음 볼 때, 이렇게 보세요" sub="규칙을 다 외울 필요 없어요. 이 다섯 가지만으로 충분히 빠져듭니다." />
          <div>
            {[
              { title: '한 명(또는 한 팀)을 정해 응원하세요', desc: '감정이입할 대상이 생기면 90분이 순식간에 지나갑니다.' },
              { title: '출발과 첫 몇 코너에 집중', desc: "\'라이트 아웃\' 직후가 순위 변화가 가장 격렬한 구간이에요." },
              { title: '피트스톱 타이밍을 지켜보세요', desc: '누가 언제 들어오느냐로 보이지 않던 전략 싸움이 드러납니다.' },
              { title: '화면 그래픽을 믿으세요', desc: '간격·타이어·순위가 다 표시돼요. 이 가이드 맨 위 타이밍 보드가 그거예요.' },
              { title: '가능하면 예선부터', desc: '출발 순서의 맥락을 알고 보면 결승이 두 배로 흥미진진해집니다.' },
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 18, padding: '18px 0', borderBottom: i < 4 ? '1px solid #E0D9CB' : 'none', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: RED, fontSize: 14, flexShrink: 0, border: '1px solid #E0D9CB', borderRadius: 2, padding: '5px 9px', lineHeight: 1 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{tip.title}</div>
                  <div style={{ fontSize: 14, color: '#4A4338', lineHeight: 1.6 }}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 다음 경기 */}
      {upcomingRaces.length > 0 && (
        <section style={{ background: '#15120D', color: '#F2EFE8', padding: '64px 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: RED, marginBottom: 12 }}>이번 시즌 일정</div>
                <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>다음 경기 미리보기</h2>
              </div>
              <Link href="/#schedule" style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C9C1B2', textDecoration: 'none', borderBottom: '2px solid #C9C1B2', paddingBottom: 4 }}>전체 일정 보기 →</Link>
            </div>
            <div style={{ borderTop: '1px solid #2C271F' }}>
              {upcomingRaces.map((r) => {
                const d = new Date(r.date)
                return (
                  <div key={`${r.round}-${r.name}`} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, padding: '22px 8px', borderBottom: '1px solid #2C271F' }}>
                    <div style={{ width: 5, alignSelf: 'stretch', background: RED, minHeight: 48, flexShrink: 0 }} />
                    <div style={{ flexShrink: 0, width: 72, textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 30, lineHeight: 0.9 }}>{String(d.getDate()).padStart(2, '0')}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#9A9081', letterSpacing: '0.08em', marginTop: 4 }}>{MONTHS[d.getMonth()]}</div>
                    </div>
                    <div style={{ flex: '1 1 240px', minWidth: 180 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A', letterSpacing: '0.08em', marginBottom: 5 }}>ROUND {r.round}</div>
                      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 800, fontSize: 20, lineHeight: 1.1, textTransform: 'uppercase' }}>{r.name}</div>
                    </div>
                    <div style={{ flex: '1 1 160px', minWidth: 130 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{r.circuit}</div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#9A9081', marginTop: 3 }}>{r.loc}</div>
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
        <div style={{ fontSize: 32, marginBottom: 16 }}>🏎️</div>
        <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: 16 }}>이제 경기가 기대되지 않으신가요?</h2>
        <p style={{ fontSize: 16, color: '#4A4338', marginBottom: 32 }}>OneLap과 함께, 첫 경기를 최대한 즐겨보세요.</p>
        <Link href="/#schedule" style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', color: '#fff', background: RED, padding: '14px 32px', borderRadius: 2 }}>
          다음 경기 일정 확인 →
        </Link>
      </section>
    </div>
  )
}
