import type { ReactNode } from 'react'
import Link from 'next/link'
import { SERIES, buildSchedule } from '@/lib/data'
import { fetchF1Races } from '@/lib/f1Api'

export const revalidate = 3600

const GREEN = '#0E8C5A'
const GOLD = '#D4A017'
const BEAM = '#38A8C8'
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

function SecHead({ num, title, sub }: { num: string; title: string; sub: ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 10 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, color: GREEN, border: '1px solid #E0D9CB', borderRadius: 2, padding: '4px 9px' }}>
          {num}
        </span>
        <h2 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 900, fontSize: 'clamp(22px,3.4vw,34px)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
          {title}
        </h2>
      </div>
      <p style={{ fontSize: 15, color: '#857A6A', maxWidth: '62ch', lineHeight: 1.6 }}>{sub}</p>
    </div>
  )
}

function Hl({ children }: { children: ReactNode }) {
  return <span style={{ fontWeight: 700, color: '#15120D' }}>{children}</span>
}
function HlG({ children }: { children: ReactNode }) {
  return <span style={{ fontWeight: 700, color: GOLD }}>{children}</span>
}
function HlB({ children }: { children: ReactNode }) {
  return <span style={{ fontWeight: 700, color: BEAM }}>{children}</span>
}

export default async function WECGuidePage() {
  const f1Races = await fetchF1Races()
  const schedule = buildSchedule(f1Races)
  const upcomingRaces = schedule.filter((r) => r.sport === 'wec').slice(0, 3)

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
            const isActive = s.id === 'wec'
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
      <section style={{ background: GREEN, padding: '60px 24px 56px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(820px 420px at 80% -5%, rgba(246,181,69,.14), transparent 60%), radial-gradient(680px 360px at 8% 115%, rgba(95,217,255,.10), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center' }}>

          {/* 텍스트 */}
          <div style={{ flex: '1 1 380px', color: '#fff' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '6px 14px', marginBottom: 18 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>초심자 환영</span>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', opacity: 0.75, marginBottom: 10 }}>FIA World Endurance Championship · 입문 가이드</div>
            <h1 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(40px,6vw,72px)', lineHeight: 0.92, letterSpacing: '-0.03em', textTransform: 'uppercase', marginBottom: 10 }}>ENDURANCE</h1>
            <div style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 900, fontSize: 'clamp(18px,3vw,34px)', lineHeight: 1.1, opacity: 0.9, marginBottom: 22 }}>
              가장 빠른 차가 아니라<br /><span style={{ color: '#FFD86B' }}>끝까지 버틴 차</span>가 이긴다
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.7, opacity: 0.88, maxWidth: '42ch' }}>
              WEC를 한 번도 안 본 사람을 위한 안내서. 한 트랙에 <strong style={{ fontWeight: 700 }}>두 종류의 차가 동시에</strong> 달리고, <strong style={{ fontWeight: 700 }}>한 대를 여러 명이 교대</strong>로 몰며, 순위를 <strong style={{ fontWeight: 700 }}>'시간'으로 가리는</strong> — F1과는 전혀 다른 레이스의 세계로 안내합니다.
            </p>
          </div>

          {/* 24H 다이얼 위젯 */}
          <div style={{ flex: '1 1 300px', maxWidth: 420 }}>
            <div style={{ background: 'linear-gradient(180deg,#14182e,#0e1124)', border: '1px solid #272d4d', borderRadius: 14, padding: '20px 20px 18px', boxShadow: '0 34px 70px -34px rgba(0,0,0,.9)', fontFamily: "'Space Mono', monospace" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11, letterSpacing: '0.16em', color: '#9298b5', textTransform: 'uppercase', marginBottom: 16 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                  <span className="wec-live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff6a4d', display: 'inline-block' }} />
                  24H Le Mans
                </span>
                <span>DAY → NIGHT → DAWN</span>
              </div>

              {/* 다이얼 */}
              <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 14px' }}>
                {/* 링 */}
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, #f6b545 0deg, #ffcf7a 26deg, #ff8a4d 52deg, #ff6a4d 72deg, #6d4fae 96deg, #2f2f63 122deg, #1a1d40 150deg, #15183a 195deg, #5b4fae 212deg, #f0a64a 230deg, #f6b545 252deg, #ffd98a 300deg, #f6b545 360deg)',
                  WebkitMask: 'radial-gradient(circle, transparent 60%, #000 61%)',
                  mask: 'radial-gradient(circle, transparent 60%, #000 61%)',
                }} />
                {/* 바늘 */}
                <div className="wec-dial-hand" />
                {/* 코어 */}
                <div style={{ position: 'absolute', inset: '30%', borderRadius: '50%', background: '#14182e', border: '1px solid #272d4d', display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 26, lineHeight: 0.9, color: '#eef0f7' }}>24:00</div>
                    <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.18em', color: '#f6b545', marginTop: 6 }}>ON TRACK</div>
                  </div>
                </div>
                {/* 눈금 텍스트 */}
                <span style={{ position: 'absolute', left: '50%', top: 4, transform: 'translateX(-50%)', fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#9298b5' }}>16:00 START</span>
                <span style={{ position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#9298b5' }}>22:00</span>
                <span style={{ position: 'absolute', left: '50%', bottom: 4, transform: 'translateX(-50%)', fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#9298b5' }}>02:00</span>
                <span style={{ position: 'absolute', left: 2, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#9298b5' }}>07:00</span>
              </div>

              {/* 범례 */}
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12, paddingTop: 12, borderTop: '1px solid #272d4d', fontSize: 11, color: '#9298b5' }}>
                {([['#f6b545','낮·해질녘'],['#2f2f63','한밤중'],['#f0a64a','새벽']] as [string,string][]).map(([c, l]) => (
                  <span key={l} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 14, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />{l}
                  </span>
                ))}
              </div>
              <p style={{ marginTop: 14, fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, color: '#9298b5', lineHeight: 1.55, textAlign: 'center' }}>
                오후에 출발해 <strong style={{ color: '#eef0f7', fontWeight: 500 }}>밤을 새우고 다음 날 오후</strong>에 끝나는 레이스. 헤드라이트만 켜고 달리는 새벽 구간을 버텨내는 것 — 그게 내구 레이스의 본질이에요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 01. WEC, 한 줄로 말하면 */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="01" title="WEC, 한 줄로 말하면" sub="세계 최고의 '내구(耐久) 레이스' 챔피언십. 빠르기만 한 게 아니라, 오래 달려도 무너지지 않는 차와 팀을 가립니다." />
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch' }}>
            WEC(세계 내구 레이스 챔피언십)는 <Hl>몇 시간씩 쉬지 않고 달리는</Hl> 장거리 자동차 경주의 최고 무대예요. 한 바퀴의 속도도 중요하지만, 진짜 승부는 <Hl>차가 끝까지 버티느냐</Hl>, <Hl>팀이 실수 없이 운영하느냐</Hl>에서 갈립니다. 그래서 F1이 단거리 스프린터라면, WEC는 <Hl>마라톤</Hl>에 가까워요.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch', marginTop: 14 }}>
            2026년에는 한국 분들이 반가워할 소식도 있어요 — 현대의 럭셔리 브랜드 <HlG>제네시스(Genesis Magma Racing)</HlG>가 최상위 클래스에 처음으로 뛰어듭니다.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginTop: 32 }}>
            {[
              { big: '8',    lab: '라운드 (3월~)',     note: '5개 대륙 순회' },
              { big: '35',   lab: '출전 차량',          note: '하이퍼카 17 + LMGT3 18' },
              { big: '14',   lab: '참가 제조사',         note: '2026 · 역대급 규모' },
              { big: '24h',  lab: '르망의 길이',         note: '시즌 최대 이벤트' },
            ].map((s) => (
              <div key={s.lab} style={{ background: '#fff', borderLeft: `3px solid ${GREEN}`, borderRadius: 4, padding: '22px 20px' }}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 40, lineHeight: 1 }}>{s.big}</div>
                <div style={{ fontSize: 14, color: '#4A4338', marginTop: 8 }}>{s.lab}</div>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A', marginTop: 4 }}>{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 02. 한 트랙, 두 종류의 차 */}
      <section style={{ padding: '72px 0', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="02" title="한 트랙, 두 종류의 차" sub="WEC를 처음 보면 가장 헷갈리는 부분. 성격이 다른 두 클래스가 같은 시간, 같은 코스에서 동시에 경주합니다." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {/* 하이퍼카 */}
            <div style={{ background: '#fff', border: '1px solid #E0D9CB', borderTop: `4px solid ${GOLD}`, borderRadius: 4, padding: 26 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD, border: '1px solid #E0D9CB', borderRadius: 4, padding: '4px 9px', display: 'inline-block', marginBottom: 14 }}>최상위 클래스</span>
              <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 4 }}>하이퍼카 <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#857A6A', fontWeight: 400 }}>Hypercar</span></h3>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: GOLD, letterSpacing: '0.06em', marginBottom: 12 }}>가장 빠른 프로토타입</div>
              <p style={{ fontSize: 14, color: '#4A4338', lineHeight: 1.65 }}>오직 경주를 위해 만든 최첨단 하이브리드 레이스카. 종합 우승은 늘 이 클래스에서 나옵니다.</p>
              <ul style={{ listStyle: 'none', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {['LMH·LMDh 두 가지 규정으로 제작', '페라리·토요타·캐딜락·BMW·알핀·푸조·애스턴마틴·제네시스', '종합 1위 = 하이퍼카 1위'].map((li) => (
                  <li key={li} style={{ fontSize: 13, color: '#4A4338', paddingLeft: 18, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, top: '0.62em', width: 7, height: 7, borderRadius: '50%', background: GOLD, display: 'inline-block' }} />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
            {/* LMGT3 */}
            <div style={{ background: '#fff', border: '1px solid #E0D9CB', borderTop: `4px solid ${BEAM}`, borderRadius: 4, padding: 26 }}>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: BEAM, border: '1px solid #E0D9CB', borderRadius: 4, padding: '4px 9px', display: 'inline-block', marginBottom: 14 }}>GT 클래스</span>
              <h3 style={{ fontSize: 21, fontWeight: 700, marginBottom: 4 }}>LMGT3 <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: '#857A6A', fontWeight: 400 }}>GT3</span></h3>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: BEAM, letterSpacing: '0.06em', marginBottom: 12 }}>시판차 기반 GT 레이스카</div>
              <p style={{ fontSize: 14, color: '#4A4338', lineHeight: 1.65 }}>도로에서 보는 슈퍼카를 경주용으로 개조한 차. 더 느리지만, 익숙한 브랜드를 응원하는 재미가 있어요.</p>
              <ul style={{ listStyle: 'none', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                {['포르쉐·페라리·콜벳·맥라렌·BMW·포드·렉서스·벤츠·애스턴마틴', <>크루에 <HlB>아마추어(브론즈) 드라이버 1명 필수</HlB></>, '별도의 클래스 우승을 다툼'].map((li, i) => (
                  <li key={i} style={{ fontSize: 13, color: '#4A4338', paddingLeft: 18, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 0, top: '0.62em', width: 7, height: 7, borderRadius: '50%', background: BEAM, display: 'inline-block' }} />
                    {li}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginTop: 20, background: 'rgba(56,168,200,0.07)', border: '1px solid rgba(56,168,200,0.28)', borderRadius: 4, padding: '18px 20px', fontSize: 14, color: '#3A352C', lineHeight: 1.65 }}>
            <strong style={{ color: BEAM }}>그래서 &apos;트래픽&apos;이 묘미예요.</strong> 빠른 하이퍼카가 느린 LMGT3를 따라잡아 추월하는 장면이 끊임없이 벌어집니다. 느린 차를 깔끔하게 제치는 것도, 빠른 차에게 길을 잘 비켜주는 것도 모두 실력이죠. 차에 붙은 <span style={{ color: GOLD, fontWeight: 700 }}>금색</span>·<span style={{ color: BEAM, fontWeight: 700 }}>하늘색</span> 표시로 클래스를 구분하면 한결 보기 쉬워요.
          </div>
        </div>
      </section>

      {/* 03. 한 대의 차, 여러 명의 드라이버 */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="03" title="한 대의 차, 여러 명의 드라이버" sub="F1은 한 차에 한 명. WEC는 다릅니다 — 사람이 그렇게 오래 운전할 수 없으니까요." />
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch', marginBottom: 24 }}>
            한 대를 보통 <Hl>세 명의 드라이버</Hl>가 나눠 탑니다. 한 명이 한두 시간 몰면 피트에 들어와 교대하고, 다른 동료가 이어받죠. 그래서 세 명 모두가 빨라야 하고, <Hl>팀워크와 체력 관리</Hl>가 곧 경쟁력이 됩니다.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { num: '1', name: '드라이버 A', desc: '출발 스틴트 — 초반 순위 싸움' },
              { num: '2', name: '드라이버 B', desc: '교대 — 페이스 유지·연료 관리' },
              { num: '3', name: '드라이버 C', desc: '야간·마무리 — 끝까지 집중' },
            ].map((seat) => (
              <div key={seat.num} style={{ flex: '1 1 150px', background: '#fff', border: '1px solid #E0D9CB', borderRadius: 4, padding: '20px 18px', textAlign: 'center' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', margin: '0 auto 10px', display: 'grid', placeItems: 'center', background: '#EAE5DA', border: `1px solid ${GREEN}`, fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 18, color: GREEN }}>{seat.num}</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{seat.name}</div>
                <div style={{ fontSize: 13, color: '#857A6A', marginTop: 5, lineHeight: 1.5 }}>{seat.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch', marginTop: 22 }}>
            특히 LMGT3에서는 크루에 <HlB>&apos;브론즈&apos; 등급의 아마추어 드라이버</HlB>가 반드시 한 명 들어가야 해요. 프로와 아마추어가 한 팀으로 묶이는 점도 내구 레이스만의 독특한 매력입니다.
          </p>
        </div>
      </section>

      {/* 04. '몇 바퀴'가 아니라 '몇 시간' */}
      <section style={{ padding: '72px 0', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="04" title="'몇 바퀴'가 아니라 '몇 시간'" sub="WEC 레이스는 정해진 시간 동안 달립니다. 그 시간 안에 가장 먼 거리를 간 차가 승자예요." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {[
              { hh: '6h',  name: '6시간 레이스',  desc: '시즌의 기본 형태. 대부분의 라운드가 여기에 속해요.', crown: false },
              { hh: '8h',  name: '8시간 레이스',  desc: '시즌 피날레인 바레인 등 일부 장거리 라운드.', crown: false },
              { hh: '24h', name: '24시간 르망',    desc: '내구 레이스의 성지. 낮·밤·새벽을 모두 통과하는 시즌의 백미.', crown: true },
            ].map((d) => (
              <div key={d.hh} style={{ background: d.crown ? 'linear-gradient(180deg, rgba(212,160,23,.07), #fff)' : '#fff', border: `1px solid ${d.crown ? 'rgba(212,160,23,.5)' : '#E0D9CB'}`, borderRadius: 4, padding: '24px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 44, lineHeight: 1, color: d.crown ? GOLD : '#15120D' }}>{d.hh}</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginTop: 8 }}>{d.name}</div>
                <div style={{ fontSize: 13, color: '#857A6A', marginTop: 6, lineHeight: 1.55 }}>{d.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch', marginTop: 22 }}>
            정해진 시간이 끝나갈 무렵, 선두 차가 결승선을 통과하면 그 순간 레이스가 끝납니다. <Hl>24시간 르망</Hl>은 그중에서도 특별해서, 이 한 경기에서 우승하는 것을 F1 모나코 우승, 인디 500 우승과 함께 <HlG>&apos;트리플 크라운&apos;</HlG>의 하나로 칠 정도예요.
          </p>
        </div>
      </section>

      {/* 05. 이것만 알면 레이스가 읽힌다 */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="05" title="이것만 알면 레이스가 읽힌다" sub="내구 레이스에서 가장 자주 등장하는 개념들." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {([
              { title: '피트스톱',             tag: '교대 + 주유 + 타이어', body: <>F1과 달리 <Hl>주유</Hl>와 <Hl>드라이버 교대</Hl>까지 한 번에 합니다. 그래서 시간이 더 길고, 이 작업을 얼마나 매끄럽게 하느냐가 순위를 좌우해요.</> },
              { title: 'BoP',                  tag: '밸런스 오브 퍼포먼스',  body: <>서로 다른 차들의 성능을 <Hl>인위적으로 비슷하게</Hl> 맞추는 규칙. 덕분에 페라리·토요타·캐딜락이 한데 엉켜 접전을 펼칠 수 있어요.</> },
              { title: '스틴트',               tag: 'Stint',               body: <>한 드라이버가 교대 없이 연속으로 도는 구간. 타이어를 갈지 않고 두 스틴트를 이어 달리면 <Hl>더블 스틴트</Hl>라고 합니다.</> },
              { title: '풀코스 옐로 · 세이프티카', tag: 'FCY / SC',          body: <>사고가 나면 코스 전체의 속도를 통제합니다. 벌어졌던 간격이 좁혀지고, 이 타이밍에 피트인하면 시간을 크게 아낄 수 있어 <Hl>전략의 분기점</Hl>이 돼요.</> },
            ] as { title: string; tag: string; body: ReactNode }[]).map((card) => (
              <div key={card.title} style={{ background: '#fff', border: '1px solid #E0D9CB', borderRadius: 4, padding: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                  <h3 style={{ fontWeight: 700, fontSize: 17 }}>{card.title}</h3>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: GREEN, border: '1px solid #E0D9CB', padding: '2px 7px', borderRadius: 2, fontWeight: 700, whiteSpace: 'nowrap' }}>{card.tag}</span>
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: '#4A4338' }}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 06. 네 개의 챔피언십, 그리고 점수 */}
      <section style={{ padding: '72px 0', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="06" title="네 개의 챔피언십, 그리고 점수" sub="클래스가 둘이라 트로피도 여러 개예요. 점수 방식만 알면 순위표가 보입니다." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
            {[
              { c: GOLD, cat: 'Hypercar · 개인', title: '하이퍼카 드라이버 월드 챔피언', desc: '최상위 클래스 드라이버들의 개인 타이틀.' },
              { c: GOLD, cat: 'Hypercar · 제조사', title: '하이퍼카 제조사 월드 챔피언', desc: '페라리·토요타 등 브랜드 간의 자존심 싸움.' },
              { c: BEAM, cat: 'LMGT3 · 개인', title: 'LMGT3 드라이버 트로피', desc: 'GT 클래스 드라이버들의 타이틀.' },
              { c: BEAM, cat: 'LMGT3 · 팀', title: 'LMGT3 팀 트로피', desc: 'GT 클래스 팀(엔트리) 간의 경쟁.' },
            ].map((ch) => (
              <div key={ch.title} style={{ background: '#fff', border: '1px solid #E0D9CB', borderLeft: `3px solid ${ch.c}`, borderRadius: 4, padding: '18px 20px' }}>
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.1em', color: ch.c, textTransform: 'uppercase', marginBottom: 6 }}>{ch.cat}</div>
                <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{ch.title}</h4>
                <p style={{ fontSize: 13, color: '#857A6A', lineHeight: 1.55 }}>{ch.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch', marginTop: 24 }}>
            점수는 각 클래스에서 <Hl>상위 10위까지</Hl> 차등 지급(1위 25점 → 10위 1점)되고, 11위 아래도 완주하면 <Hl>0.5점</Hl>을 받아요. <HlG>예선 1위(하이퍼폴)</HlG>엔 +1점, 그리고 <Hl>24시간 르망처럼 긴 레이스</Hl>는 더 많은 점수가 걸려 시즌 막판까지 변수가 됩니다.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: '#3A352C', maxWidth: '64ch', marginTop: 14 }}>
            <Hl>하이퍼폴(Hyperpole)</Hl>은 예선에서 가장 빠른 차들만 모아 다시 한 번 겨루는 결선 — 여기서 결승 출발 순서의 맨 앞이 정해집니다.
          </p>
        </div>
      </section>

      {/* 07. 중계에서 자주 듣는 말 */}
      <section style={{ background: '#EAE5DA', borderTop: '1px solid #E0D9CB', padding: '72px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="07" title="중계에서 자주 듣는 말" sub="이 단어들만 익혀두면 해설이 훨씬 잘 들립니다." />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 36px' }}>
            {[
              { kr: '스틴트',       en: 'Stint',                def: '한 드라이버가 교대 없이 연속으로 도는 구간.' },
              { kr: '더블 스틴트',  en: 'Double Stint',         def: '타이어를 갈지 않고 두 스틴트를 이어 달리는 것.' },
              { kr: '하이퍼폴',     en: 'Hyperpole',            def: '빠른 차들만 모아 폴 포지션을 가리는 예선 결선.' },
              { kr: 'BoP',          en: 'Balance of Performance',def: '서로 다른 차의 성능을 맞춰 접전을 유도하는 규칙.' },
              { kr: '트래픽',       en: 'Traffic',              def: '느린 클래스 차를 추월하며 헤쳐 나가는 상황.' },
              { kr: '풀코스 옐로',  en: 'FCY',                  def: '코스 전체의 속도를 일정하게 통제하는 상태.' },
              { kr: '슬로우 존',    en: 'Slow Zone',            def: '위험 구간만 부분적으로 속도를 제한하는 방식.' },
              { kr: '트리플 크라운', en: 'Triple Crown',        def: '르망 24시·모나코 GP·인디 500 우승을 일컫는 영예.' },
            ].map((t) => (
              <div key={t.kr} style={{ padding: '16px 0', borderBottom: '1px solid #E0D9CB' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontWeight: 700, fontSize: 15, marginBottom: 5, flexWrap: 'wrap' }}>
                  {t.kr}
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: GREEN, fontWeight: 500 }}>{t.en}</span>
                </div>
                <p style={{ fontSize: 14, color: '#4A4338', lineHeight: 1.6 }}>{t.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 08. 처음 볼 때, 이렇게 보세요 */}
      <section style={{ padding: '72px 0', borderTop: '1px solid #E0D9CB' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <SecHead num="08" title="처음 볼 때, 이렇게 보세요" sub="24시간을 다 볼 필요는 없어요. 이 다섯 가지면 충분히 빠져듭니다." />
          <div>
            {[
              { title: '시작은 24시간 르망으로', desc: '가장 화려하고 드라마가 많은 경기예요. WEC의 모든 매력이 여기 모여 있습니다.' },
              { title: '차의 클래스 색부터 구분하세요', desc: '하이퍼카(금색)와 LMGT3(하늘색)를 나눠 보면 순위가 단번에 정리됩니다.' },
              { title: '밤 시간대를 놓치지 마세요', desc: '헤드라이트만으로 달리는 야간 구간이 내구 레이스의 가장 아름답고 위태로운 순간이에요.' },
              { title: '피트스톱의 교대 장면을 보세요', desc: '드라이버가 바뀌고 주유까지 하는 그 몇십 초에 전략이 압축돼 있어요.' },
              { title: '한 차(또는 한 브랜드)를 정해 응원하세요', desc: '긴 경기일수록 응원할 대상이 있으면 끝까지 손에 땀을 쥐게 됩니다.' },
            ].map((tip, i) => (
              <div key={i} style={{ display: 'flex', gap: 18, padding: '18px 0', borderBottom: i < 4 ? '1px solid #E0D9CB' : 'none', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: GREEN, fontSize: 14, flexShrink: 0, border: '1px solid #E0D9CB', borderRadius: 2, padding: '5px 9px', lineHeight: 1 }}>
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
                <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: GREEN, marginBottom: 12 }}>이번 시즌 일정</div>
                <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>다음 경기 미리보기</h2>
              </div>
              <Link href="/#schedule" style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#C9C1B2', textDecoration: 'none', borderBottom: '2px solid #C9C1B2', paddingBottom: 4 }}>전체 일정 보기 →</Link>
            </div>
            <div style={{ borderTop: '1px solid #2C271F' }}>
              {upcomingRaces.map((r) => {
                const d = new Date(r.date)
                return (
                  <div key={`${r.round}-${r.name}`} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20, padding: '22px 8px', borderBottom: '1px solid #2C271F' }}>
                    <div style={{ width: 5, alignSelf: 'stretch', background: GREEN, minHeight: 48, flexShrink: 0 }} />
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
        <div style={{ fontSize: 32, marginBottom: 16 }}>🏁</div>
        <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1.0, letterSpacing: '-0.02em', marginBottom: 16 }}>이 가이드의 숫자와 규정은 2026 시즌 기준입니다.</h2>
        <p style={{ fontSize: 16, color: '#4A4338', marginBottom: 32 }}>참가 제조사·드라이버·캘린더는 매년 바뀌니, 시즌이 넘어가면 이 부분만 업데이트하면 돼요.</p>
        <Link href="/#schedule" style={{ display: 'inline-block', fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', color: '#fff', background: GREEN, padding: '14px 32px', borderRadius: 2 }}>
          다음 경기 일정 확인 →
        </Link>
      </section>
    </div>
  )
}
