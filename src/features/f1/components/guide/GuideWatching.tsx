import type { ReactNode } from 'react'
import { SecHead, Hl } from './primitives'
import GuideUndercutOvercut from './GuideUndercutOvercut'

const CHANGE_CARDS: { title: string; tag: string; body: ReactNode }[] = [
  {
    title: '추월 보조',
    tag: '2026 신규',
    body: (
      <>
        예전의 <Hl>DRS</Hl>는 2026년부터 사라졌어요. 대신 직선에서 날개를 눕혀 공기저항을 줄이는 <Hl>액티브 에어로</Hl>와, 앞차에 <Hl>1초 이내</Hl>로 붙으면 전기 동력을 더 쏟아붓는 <Hl>오버테이크 모드</Hl>로 추월을 돕습니다.
      </>
    ),
  },
  {
    title: '피트스톱',
    tag: '≈ 2초',
    body: (
      <>
        타이어를 갈러 정비 구역에 들어오는 것. 숙련된 팀은 <Hl>2초대</Hl>에 끝냅니다. 상대보다 먼저 들어와 새 타이어로 앞서는 <Hl>언더컷</Hl>, 반대로 버티다 나중에 들어가는 <Hl>오버컷</Hl> 같은 전략이 여기서 나와요.
      </>
    ),
  },
  {
    title: '세이프티카',
    tag: 'SC',
    body: (
      <>
        사고나 위험이 생기면 안전차가 코스에 나와 모두의 속도를 통제합니다. 벌어졌던 간격이 <Hl>한꺼번에 좁혀져</Hl> 경기 양상이 뒤집히곤 하죠.
      </>
    ),
  },
  {
    title: '더티 에어',
    tag: 'Dirty Air',
    body: (
      <>
        앞차가 만든 <Hl>난기류</Hl>. 바로 뒤를 따라가면 차가 불안정해져 추월이 어려워집니다. F1 배틀이 쉽지 않은 핵심 이유예요.
      </>
    ),
  },
]

const TERMS = [
  { kr: '폴 포지션', en: 'Pole', def: '예선 1위. 결승 맨 앞에서 출발하는 자리.' },
  { kr: '포디움', en: 'Podium', def: '상위 3위까지 오르는 시상대. "포디움에 섰다" = 3위 안.' },
  { kr: '그리드', en: 'Grid', def: '결승 출발 대형. 예선 결과로 자리가 정해짐.' },
  { kr: '박스, 박스', en: 'Box', def: '"피트로 들어와라"라는 팀 무전 신호.' },
  { kr: '언더컷', en: 'Undercut', def: '상대보다 먼저 새 타이어로 갈아 앞서는 전략.' },
  { kr: '오버컷', en: 'Overcut', def: '상대가 먼저 피트하는 동안 트랙에 남아 깨끗한 공기에서 시간을 버는 전략.' },
  { kr: '패스티스트 랩', en: 'Fastest Lap', def: '그 경기에서 가장 빠른 한 바퀴 기록.' },
  { kr: '포메이션 랩', en: 'Formation Lap', def: '출발 직전, 대형을 갖추며 도는 준비 바퀴.' },
  { kr: '라이트 아웃', en: 'Lights Out', def: '출발 신호등이 모두 꺼지는 순간 = 레이스 시작!' },
]

const TIPS = [
  { title: '한 명(또는 한 팀)을 정해 응원하세요', desc: '감정이입할 대상이 생기면 90분이 순식간에 지나갑니다.' },
  { title: '출발과 첫 몇 코너에 집중', desc: "'라이트 아웃' 직후가 순위 변화가 가장 격렬한 구간이에요." },
  { title: '피트스톱 타이밍을 지켜보세요', desc: '누가 언제 들어오느냐로 보이지 않던 전략 싸움이 드러납니다.' },
  { title: '화면 그래픽을 믿으세요', desc: '간격·타이어·순위가 중계 화면 상단이나 구석에 다 표시돼요. 처음엔 몰라도 보다 보면 저절로 읽혀요.' },
  { title: '가능하면 예선부터', desc: '출발 순서의 맥락을 알고 보면 결승이 두 배로 흥미진진해집니다.' },
]

export default function GuideWatching() {
  return (
    <>
      {/* 06. 레이스를 바꾸는 네 가지 */}
      <section className="py-[72px] border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead num="06" title="레이스를 바꾸는 네 가지" sub="중계에서 가장 자주 나오는 개념 — 추월, 피트스톱, 세이프티카, 더티 에어." />
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {CHANGE_CARDS.map((card) => (
              <div key={card.title} className="bg-white border border-border rounded p-6">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <h3 className="font-bold text-[17px]">{card.title}</h3>
                  <span className="font-mono text-[10px] text-accent border border-border px-1.5 py-0.5 rounded-sm font-bold whitespace-nowrap">{card.tag}</span>
                </div>
                <p className="text-sm leading-[1.65] text-text-mid">{card.body}</p>
              </div>
            ))}
          </div>

          <GuideUndercutOvercut />
        </div>
      </section>

      {/* 08. 용어집 */}
      <section className="py-[72px] border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead num="08" title="중계에서 자주 듣는 말" sub="이 단어들만 익혀두면 해설이 훨씬 잘 들립니다." />
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0 36px' }}>
            {TERMS.map((t) => (
              <div key={t.kr} className="py-4 border-b border-border">
                <div className="flex items-baseline gap-2.5 font-bold text-[15px] mb-[5px]">
                  {t.kr}
                  <span className="font-mono text-[10px] text-accent font-medium">{t.en}</span>
                </div>
                <p className="text-sm text-text-mid leading-[1.6]">{t.def}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 09. 처음 볼 때 */}
      <section className="bg-bg-alt border-t border-border py-[72px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead num="09" title="처음 볼 때, 이렇게 보세요" sub="규칙을 다 외울 필요 없어요. 이 다섯 가지만으로 충분히 빠져듭니다." />
          <div>
            {TIPS.map((tip, i) => (
              <div key={tip.title} className={`flex gap-[18px] py-[18px] items-start ${i < TIPS.length - 1 ? 'border-b border-border' : ''}`}>
                <span className="font-mono font-bold text-accent text-sm flex-shrink-0 border border-border rounded-sm px-2.5 py-1.5 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <div className="font-bold text-base mb-1">{tip.title}</div>
                  <div className="text-sm text-text-mid leading-[1.6]">{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
