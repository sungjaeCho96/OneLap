import { Hl } from './primitives'

type Driver = 'A' | 'B'
type Tire = 'new' | 'old'

interface RowSpec {
  driver: Driver
  tire: Tire
  pit?: boolean
}

interface FrameSpec {
  step: string
  rows: [RowSpec, RowSpec]
  caption: string
  success?: Driver
}

const DRIVER_CHIP: Record<Driver, string> = {
  A: 'bg-accent text-white',
  B: 'bg-text-dim text-white',
}

function PositionRow({ pos, driver, tire, pit, success }: { pos: 1 | 2; success?: Driver } & RowSpec) {
  const isWinner = success === driver
  return (
    <div className={`flex items-center gap-2 py-1.5 ${isWinner ? 'rounded px-1.5 -mx-1.5 bg-accent/10' : ''}`}>
      <span className="font-mono text-[10px] font-bold text-text-muted w-6 flex-shrink-0">{pos}위</span>
      <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold flex-shrink-0 ${DRIVER_CHIP[driver]}`}>
        {driver}
      </span>
      <span
        className={`font-mono text-[10px] px-1.5 py-0.5 rounded-sm border flex-shrink-0 ${
          tire === 'new' ? 'border-accent text-accent' : 'border-border text-text-dim'
        }`}
      >
        {tire === 'new' ? '새 타이어' : '헌 타이어'}
      </span>
      {pit && (
        <span className="font-mono text-[10px] font-bold text-white bg-text px-1.5 py-0.5 rounded-sm whitespace-nowrap flex-shrink-0">
          PIT
        </span>
      )}
      {isWinner && (
        <span className="font-mono text-[10px] font-bold text-accent whitespace-nowrap flex-shrink-0">성공!</span>
      )}
    </div>
  )
}

function Frame({ step, rows, caption, success }: FrameSpec) {
  return (
    <div className="flex-1 min-w-[160px] bg-white border border-border rounded p-3.5">
      <div className="font-mono text-[10px] font-bold text-accent mb-2">{step}</div>
      <div>
        <PositionRow pos={1} success={success} {...rows[0]} />
        <PositionRow pos={2} success={success} {...rows[1]} />
      </div>
      <p className="text-[12px] text-text-mid leading-[1.5] mt-2">{caption}</p>
    </div>
  )
}

function StrategyDiagram({
  title,
  tag,
  frames,
  note,
}: {
  title: string
  tag: string
  frames: FrameSpec[]
  note: string
}) {
  return (
    <div className="bg-bg-alt border border-border rounded-lg p-5">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-bold text-[16px]">{title}</h4>
        <span className="font-mono text-[10px] text-accent border border-border px-1.5 py-0.5 rounded-sm font-bold">
          {tag}
        </span>
      </div>
      <div className="flex items-center gap-3.5 mb-3.5 text-[11px] text-text-muted font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-accent inline-block" /> A = 전략을 시도하는 차
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-text-dim inline-block" /> B = 상대 차
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-2.5 items-stretch">
        {frames.map((f, i) => (
          <div key={f.step} className="flex flex-col md:flex-row gap-2.5 flex-1">
            <Frame {...f} />
            {i < frames.length - 1 && (
              <div className="flex items-center justify-center text-text-dim font-bold flex-shrink-0 text-lg">
                →
              </div>
            )}
          </div>
        ))}
      </div>
      <p className="text-[12px] text-text-muted leading-[1.6] mt-3.5">{note}</p>
    </div>
  )
}

export default function GuideUndercutOvercut() {
  return (
    <div className="mt-9">
      <div className="mb-4">
        <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent mb-1.5">전략 읽기</div>
        <h3 className="font-noto font-black leading-[1.2]" style={{ fontSize: 'clamp(18px,2.4vw,24px)' }}>
          언더컷 vs 오버컷, 그림으로 보기
        </h3>
        <p className="text-sm text-text-mid leading-[1.6] mt-1.5 max-w-[64ch]">
          둘 다 <Hl>피트스톱 타이밍</Hl>으로 순위를 바꾸려는 전략이에요. 바짝 쫓기는 상황에서 내가 먼저
          들어가면 언더컷, 버티다 나중에 들어가면 오버컷이에요.
        </p>
      </div>

      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))' }}>
        <StrategyDiagram
          title="언더컷"
          tag="Undercut"
          frames={[
            {
              step: '① 근접 추격',
              rows: [
                { driver: 'B', tire: 'old' },
                { driver: 'A', tire: 'old' },
              ],
              caption: 'A가 B 바로 뒤를 바짝 쫓고 있어요.',
            },
            {
              step: '② A 먼저 피트인',
              rows: [
                { driver: 'B', tire: 'old' },
                { driver: 'A', tire: 'new', pit: true },
              ],
              caption: 'A가 먼저 들어가 새 타이어로 갈아요. B는 아직 헌 타이어로 트랙 위에 있어요.',
            },
            {
              step: '③ B도 피트인 → 결과',
              rows: [
                { driver: 'A', tire: 'new' },
                { driver: 'B', tire: 'new' },
              ],
              caption: '새 타이어로 벌어둔 시간이 B의 피트 손실보다 크면 순위가 바뀌어요.',
              success: 'A',
            },
          ]}
          note="💡 항상 성공하는 건 아니에요. 두 차 사이 간격이 이미 넓거나, B가 곧바로 빠른 아웃랩으로 맞대응하면 실패할 수 있어요."
        />
        <StrategyDiagram
          title="오버컷"
          tag="Overcut"
          frames={[
            {
              step: '① 근접 추격',
              rows: [
                { driver: 'B', tire: 'old' },
                { driver: 'A', tire: 'old' },
              ],
              caption: '동일한 상황, 이번엔 A가 피트를 미루고 트랙에 남는 쪽을 선택해요.',
            },
            {
              step: '② B 먼저 피트인',
              rows: [
                { driver: 'B', tire: 'new', pit: true },
                { driver: 'A', tire: 'old' },
              ],
              caption: 'B가 피트로 들어가는 동안 A는 방해받지 않는 깨끗한 공기 속에서 페이스를 유지해요.',
            },
            {
              step: '③ A도 피트인 → 결과',
              rows: [
                { driver: 'A', tire: 'new' },
                { driver: 'B', tire: 'new' },
              ],
              caption: '클린 에어에서 벌어둔 시간이 충분하면 순위를 그대로 지켜요.',
              success: 'A',
            },
          ]}
          note="💡 트랙에 오래 남을수록 낡은 타이어로 더 버텨야 해서 리스크도 커요. 타이어가 급격히 나빠지면 오히려 손해예요."
        />
      </div>
    </div>
  )
}
