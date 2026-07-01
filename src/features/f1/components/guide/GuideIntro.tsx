import type { ReactNode } from 'react'
import { SecHead, Hl } from './primitives'

const WHY_CARDS: { c: string; num: string; icon: string; title: string; moment: string; desc: ReactNode }[] = [
  {
    c: '#E10600',
    num: '01',
    icon: '🎭',
    title: '사람 이야기가 있다',
    moment: '"팀메이트가 가장 위험한 적이 된다."',
    desc: (
      <>
        같은 차, 같은 타이어, 같은 데이터 — 그런데 왜 한 명은 이기고 한 명은 진걸까. <strong>22명 각자의 야망과 균열</strong>이 90분 안에 드러납니다. 챔피언의 몰락, 신인의 반란, 동료 간의 갈등. F1엔 드라마 작가가 따로 없어요.
      </>
    ),
  },
  {
    c: '#b45cff',
    num: '02',
    icon: '🧠',
    title: '알면 알수록 더 보인다',
    moment: '"피트스톱 2초가 순위를 뒤집는다."',
    desc: (
      <>
        경기 중반, 아무 일도 없어 보이는 순간 — 사실 팀은 <strong>타이어, 연료, 간격, 날씨</strong>를 모두 계산하고 있어요. 세이프티카 하나에 판이 뒤집히고, 언더컷 전략 하나가 챔피언십을 바꿉니다. 규칙을 조금씩 알게 될수록 화면이 다르게 읽혀요.
      </>
    ),
  },
  {
    c: '#f4c13b',
    num: '03',
    icon: '⚡',
    title: '보는 것만으로 압도된다',
    moment: '"시속 320km에서 브레이크를 밟는 순간."',
    desc: (
      <>
        모나코의 야간 예선, 빗속에서 물보라를 가르는 웻 레이스, 피트레인에서 새 타이어를 신고 튀어나오는 차 — <strong>설명 없이도 심장이 반응하는 장면</strong>들이 있어요. F1은 눈으로 먼저 빠져드는 스포츠입니다.
      </>
    ),
  },
]

const STATS = [
  { big: '11', lab: '참가 팀 (컨스트럭터)', note: '2026 · Cadillac 합류로 +1' },
  { big: '22', lab: '드라이버 (팀당 2명)', note: '2026 시즌 기준' },
  { big: '22', lab: '그랑프리 (3월~12월)', note: '원래 24경기 → 2경기 취소' },
]

const ROLE_CARDS = [
  {
    title: '드라이버',
    tag: '개인전',
    body: (
      <p className="text-sm leading-[1.65] text-text-mid">
        22 명의 드라이버가 각자 점수를 모아 <Hl>월드 드라이버 챔피언</Hl>을 노립니다. 우리가 흔히 &quot;올해 챔피언&quot;이라 부르는 게 보통 이쪽이에요.
      </p>
    ),
  },
  {
    title: '컨스트럭터(팀)',
    tag: '단체전',
    body: (
      <p className="text-sm leading-[1.65] text-text-mid">
        팀은 곧 <Hl>&apos;컨스트럭터&apos;</Hl>(차를 만드는 주체). 소속 두 드라이버의 점수를 합쳐 <Hl>팀 챔피언</Hl>을 다툽니다. 상금과 직결돼 팀에겐 이쪽이 더 중요하기도 해요.
      </p>
    ),
  },
]

export default function GuideIntro() {
  return (
    <>
      {/* WHY HOOK */}
      <section className="pt-20 pb-[72px] border-b border-border relative overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center max-w-[52ch] mx-auto mb-[52px]">
            <div className="font-mono text-[11px] tracking-[0.24em] uppercase text-accent mb-3.5">왜 빠져드는가</div>
            <h2
              className="font-noto font-black leading-[1.15] tracking-[-0.01em] mb-3.5"
              style={{ fontSize: 'clamp(26px,3.8vw,40px)' }}
            >
              한 번 보면 끊기 어렵습니다.<br />이유가 세 가지 있어요.
            </h2>
            <p className="text-text-muted text-base leading-[1.65]">속도 때문만이 아니에요. 사람, 전략, 그리고 그 순간 — 세 가지가 겹치는 스포츠가 F1입니다.</p>
          </div>
          <div className="grid gap-0.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {WHY_CARDS.map((card, i, arr) => (
              <div
                key={card.num}
                className="bg-white px-[30px] pt-[38px] pb-[34px]"
                style={{
                  borderRadius: i === 0 ? '4px 0 0 4px' : i === arr.length - 1 ? '0 4px 4px 0' : 0,
                  borderTop: `3px solid ${card.c}`,
                }}
              >
                <div className="font-mono text-[11px] tracking-[0.2em] opacity-70 mb-4" style={{ color: card.c }}>{card.num}</div>
                <div className="text-[28px] mb-[18px]">{card.icon}</div>
                <h3 className="text-xl font-bold mb-2.5 leading-[1.2]">{card.title}</h3>
                <div className="font-archivo font-semibold text-sm leading-[1.45] mb-3.5" style={{ color: card.c }}>{card.moment}</div>
                <p className="text-text-mid text-sm font-normal leading-[1.65]">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 01. F1, 한 줄로 말하면 */}
      <section className="bg-bg-alt border-t border-border py-[72px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead num="01" title="F1, 한 줄로 말하면" sub="세계에서 가장 빠른 자동차 경주. 한 시즌 동안 전 세계를 돌며 우승을 다투는 챔피언십입니다." />
          <p className="text-base leading-[1.75] text-text-mid max-w-[64ch]">
            F1은 <Hl>오픈휠</Hl>(바퀴가 차체 밖으로 드러난) 경주차로 겨루는 모터스포츠의 최고 무대예요.<br /> 차 한 대가 시속 300km를 넘나들고, 순위는 <Hl>0.001초</Hl> 단위로 갈립니다. <br />하지만 F1의 진짜 재미는 속도만이 아니라 <Hl>팀과 팀의 전략 싸움</Hl>에 있어요<br />언제 타이어를 갈지, 언제 추월을 시도할지의 두뇌 게임이죠.
          </p>
          <p className="text-base leading-[1.75] text-text-mid max-w-[64ch] mt-3.5">
            한 시즌은 여러 나라에서 열리는 경주(그랑프리)의 모음이고, <br />매 경주에서 쌓은 점수로 연말 챔피언을 가립니다.
          </p>
          <div className="grid gap-4 mt-8" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            {STATS.map((s) => (
              <div key={s.lab} className="bg-white border-l-[3px] border-accent rounded px-5 py-[22px]">
                <div className="font-archivo font-black text-[44px] leading-none">{s.big}</div>
                <div className="text-sm text-text-mid mt-2">{s.lab}</div>
                <div className="font-mono text-[11px] text-text-muted mt-1">{s.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-[22px] flex gap-4 items-start bg-[rgba(244,193,59,.06)] border border-[rgba(244,193,59,.3)] rounded px-5 py-[18px]">
            <div className="flex-shrink-0 text-lg mt-0.5 text-[#E8842B]">⚠</div>
            <div>
              <div className="font-bold text-[15px] text-[#E8842B] mb-[7px]">2026 시즌 특이사항 — 바레인 · 사우디아라비아 GP 취소</div>
              <p className="text-sm text-text-mid leading-[1.7]">
                2026년 2월 말 중동 전쟁이 발발하면서 바레인과 사우디아라비아가 분쟁 지역에 포함됐습니다. F1은 선수단 안전을 이유로 <strong>3월 14일 두 경기의 공식 취소</strong>를 발표했어요. 4라운드(바레인, 4/12)와 5라운드(사우디아라비아, 4/19)가 모두 빠지면서 원래 <strong>24경기였던 시즌이 22경기로 축소</strong>됐고, 일본 GP 이후 다음 경기인 마이애미 GP까지 <strong>5주 공백</strong>이 생겼습니다. 취소된 두 경기는 다른 일정으로 대체되지 않았어요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 02. 누가 경쟁하나 */}
      <section className="py-[72px] border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead num="02" title="누가 경쟁하나 — 팀과 드라이버" sub="F1엔 우승 트로피가 두 개 있습니다. 이걸 알면 순위표가 단번에 이해돼요." />
          <div className="grid gap-5 mb-[22px]" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {ROLE_CARDS.map((card) => (
              <div key={card.title} className="bg-white border border-border rounded p-6">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <h3 className="font-bold text-[17px]">{card.title}</h3>
                  <span className="font-mono text-[10px] text-accent border border-border px-1.5 py-0.5 rounded-sm font-bold">{card.tag}</span>
                </div>
                {card.body}
              </div>
            ))}
          </div>
          <p className="text-base leading-[1.75] text-text-mid max-w-[64ch]">
            즉 한 드라이버가 결승선을 통과할 때, <Hl>자신을 위한 점수</Hl>와 <Hl>팀을 위한 점수</Hl>를 동시에 버는 셈이에요. 같은 팀 동료끼리도 라이벌이 되는 이유죠.
          </p>
        </div>
      </section>
    </>
  )
}
