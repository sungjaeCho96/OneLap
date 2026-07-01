import type { ReactNode } from 'react'
import { SecHead, Hl } from './primitives'
import TireSimulator from '../TireSimulator'

const WEEKEND_STEPS: { phase: string; title: string; desc: ReactNode; arrow: boolean }[] = [
  { phase: 'Practice', title: '연습 주행', desc: '팀이 차를 세팅하고 타이어·코스에 적응하는 시간. 순위에 직접 영향은 없지만 누가 빠른지 힌트를 줍니다.', arrow: true },
  { phase: 'Qualifying', title: '예선', desc: <>가장 빠른 한 바퀴로 결승 <Hl>출발 순서(그리드)</Hl>를 정합니다. Q1·Q2·Q3로 갈수록 느린 차가 탈락. 1위가 <Hl>폴 포지션</Hl>.</>, arrow: true },
  { phase: 'Race', title: '결승', desc: '본 경기. 정해진 바퀴 수를 가장 먼저 완주하면 우승. 상위 10위까지 점수를 받습니다.', arrow: false },
]

const RACE_POINTS = [
  { pos: 'P1', pts: 25, valueColor: '#D4A017', borderColor: 'rgba(244,193,59,.5)' },
  { pos: 'P2', pts: 18, valueColor: '#888' },
  { pos: 'P3', pts: 15, valueColor: '#C87941' },
  { pos: 'P4', pts: 12 },
  { pos: 'P5', pts: 10 },
  { pos: 'P6', pts: 8 },
  { pos: 'P7', pts: 6 },
  { pos: 'P8', pts: 4 },
  { pos: 'P9', pts: 2 },
  { pos: 'P10', pts: 1 },
]

const SPRINT_POINTS = [
  { pos: 'P1', pts: 8, valueColor: '#D4A017', borderColor: 'rgba(244,193,59,.5)' },
  { pos: 'P2', pts: 7, valueColor: '#888' },
  { pos: 'P3', pts: 6, valueColor: '#C87941' },
  { pos: 'P4', pts: 5 },
  { pos: 'P5', pts: 4 },
  { pos: 'P6', pts: 3 },
  { pos: 'P7', pts: 2 },
  { pos: 'P8', pts: 1 },
]

const TIRES = [
  { c: '#ff2e55', abbr: 'S', nm: '소프트', en: 'SOFT', ds: '가장 빠르지만 가장 빨리 닳음' },
  { c: '#f4c13b', abbr: 'M', nm: '미디엄', en: 'MEDIUM', ds: '속도와 내구의 균형' },
  { c: '#aaaaaa', abbr: 'H', nm: '하드', en: 'HARD', ds: '느리지만 가장 오래 감' },
  { c: '#2fd27a', abbr: 'I', nm: '인터', en: 'INTER', ds: '젖은 노면용' },
  { c: '#3aa0ff', abbr: 'W', nm: '웻', en: 'WET', ds: '폭우·물웅덩이용' },
]

function PointsGrid({ items, colsClass }: { items: typeof RACE_POINTS; colsClass: string }) {
  return (
    <div className={`grid ${colsClass} gap-1.5 mb-4`}>
      {items.map((p) => (
        <div
          key={p.pos}
          className="bg-white rounded px-1.5 py-3.5 text-center"
          style={{ border: `1px solid ${p.borderColor ?? '#E0D9CB'}` }}
        >
          <div className="font-mono text-[10px] text-text-muted">{p.pos}</div>
          <div className="font-archivo font-black text-[22px] mt-1" style={{ color: p.valueColor ?? '#15120D' }}>{p.pts}</div>
        </div>
      ))}
    </div>
  )
}

export default function GuideRules() {
  return (
    <>
      {/* 03. 레이스 주말 */}
      <section className="bg-bg-alt border-t border-border py-[72px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead num="03" title="레이스 주말은 이렇게 흘러갑니다" sub="하루짜리 이벤트가 아니에요. 보통 3일에 걸쳐 단계가 쌓입니다." />
          <div
            className="grid gap-px bg-border border border-border rounded overflow-hidden"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}
          >
            {WEEKEND_STEPS.map((step) => (
              <div key={step.phase} className="bg-white px-[22px] py-6 relative">
                <div className="font-mono text-[11px] tracking-[0.12em] text-accent uppercase mb-2">{step.phase}</div>
                <h4 className="text-lg font-bold mb-2.5">{step.title}</h4>
                <p className="text-sm text-text-mid leading-[1.6]">{step.desc}</p>
                {step.arrow && (
                  <div className="hidden sm:flex absolute right-[-11px] top-1/2 -translate-y-1/2 z-[2] w-[22px] h-[22px] rounded-full bg-bg-alt border border-border items-center justify-center text-accent text-[11px]">→</div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 bg-[rgba(232,132,43,0.07)] border border-[rgba(232,132,43,0.28)] rounded px-[18px] py-4 text-sm text-text-mid leading-[1.65]">
            <strong className="text-[#E8842B]">스프린트 주말</strong>이라는 변형도 있어요(시즌에 몇 번). 짧은 거리의 <strong className="text-[#E8842B]">스프린트 레이스</strong>가 추가돼 별도 점수까지 걸리는, 주말 내내 긴장감이 높은 포맷입니다.
          </div>
        </div>
      </section>

      {/* 04. 점수 */}
      <section className="py-[72px] border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead num="04" title="점수는 어떻게 매겨지나" sub="결승에서 상위 10위까지만 점수를 받습니다. 1등과 2등의 차이가 꽤 크죠." />
          <div className="font-mono text-[11px] tracking-[0.08em] text-text-muted mb-2.5">A. 레이스 - 그랑프리의 본 경기</div>
          <PointsGrid items={RACE_POINTS} colsClass="grid-cols-5 sm:grid-cols-10" />
          <div className="font-mono text-[11px] tracking-[0.08em] text-text-muted mb-2.5">B. 스프린트 레이스 - 미니 레이스</div>
          <PointsGrid items={SPRINT_POINTS} colsClass="grid-cols-4 sm:grid-cols-8" />
          <p className="text-base leading-[1.75] text-text-mid max-w-[64ch] mt-[22px]">
            11위부터는 점수가 없습니다(<Hl>노 포인트</Hl>). 스프린트 레이스에서는 별도로 <Hl>8위까지</Hl> 8·7·6·5·4·3·2·1점이 주어져요. 이 점수들이 시즌 내내 쌓여 두 챔피언십의 순위가 결정됩니다.
          </p>
        </div>
      </section>

      {/* 05. 타이어 */}
      <section className="bg-bg-alt border-t border-border py-[72px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead num="05" title="타이어 — 전략의 핵심" sub="F1의 승부는 타이어에서 갈립니다. 종류만 알아도 피트스톱 전략이 보여요." />

          <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
            {TIRES.map((t) => (
              <div key={t.abbr} className="bg-white border border-border rounded px-3.5 py-[18px] text-center">
                <div
                  className="w-[54px] h-[54px] rounded-full mx-auto mb-3 bg-bg flex items-center justify-center font-mono font-bold text-sm"
                  style={{ border: `4px solid ${t.c}`, color: t.c }}
                >
                  {t.abbr}
                </div>
                <div className="font-bold text-sm">{t.nm}</div>
                <div className="font-mono text-[10px] text-text-muted tracking-[0.08em] mt-0.5">{t.en}</div>
                <div className="text-xs text-text-mid mt-2 leading-[1.5]">{t.ds}</div>
              </div>
            ))}
          </div>
          <p className="text-base leading-[1.75] text-text-mid max-w-[64ch] mt-[18px]">
            건조한 레이스에서는 <Hl>최소 두 종류</Hl>의 타이어를 써야 해서, 모두가 한 번 이상 피트에 들어옵니다.<br />&quot;빠른 타이어로 짧게 vs 오래가는 타이어로 길게&quot; — 이 선택이 승부를 가르죠.
          </p>
          <TireSimulator />
        </div>
      </section>
    </>
  )
}
