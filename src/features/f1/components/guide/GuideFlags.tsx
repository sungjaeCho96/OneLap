import { SecHead } from './primitives'
import FlagQuiz from '../FlagQuiz'

const FLAGS = [
  { bg: '#2fd27a', title: 'Green Flag', desc: '위험 해제 — 정상 주행·추월 가능. 세션 시작 신호로도 쓰임.' },
  { bg: '#f4c13b', title: 'Yellow Flag', desc: '전방 위험 — 속도를 줄이고 추월 금지.' },
  { bg: '', title: 'Double Yellow Flag', desc: '즉각 감속·추월 절대 금지 — 정지 준비. Yellow Flag보다 훨씬 위험한 상황(코스에 마샬이 있을 때).' },
  { bg: '#ff2e55', title: 'Red Flag', desc: '세션 중단 — 모두 즉시 피트로 복귀.' },
  { bg: '#3aa0ff', title: 'Blue Flag', desc: '선두권 차량 접근 — 랩 다운 드라이버는 길을 비켜야 함.' },
  { bg: '#1a1a1a', title: 'Black Flag', desc: '실격 또는 피트 복귀 명령 — 해당 드라이버에게만 제시.' },
  { bg: '#f0f0f0', title: 'White Flag', desc: '코스 위에 느린 차량(의료·안전) 존재 — 주의 요망.' },
  { bg: 'linear-gradient(135deg, #1a1a1a 0 50%, #fff 50% 100%)', title: 'Black And White Flag', desc: '비신사적 행위 경고 — 옐로카드 개념. 반복 시 Black Flag로 이어질 수 있음.' },
  { bg: 'repeating-linear-gradient(90deg, #f4c13b 0px, #f4c13b 5px, #ff2e55 5px, #ff2e55 9px)', title: 'Yellow Flag With Red Striped', desc: '노면 변화 경고 — 기름·물·잔해로 미끄러울 수 있음.' },
  { bg: 'radial-gradient(circle at 50% 50%, #ff8c00 0% 30%, #1a1a1a 30% 100%)', title: 'Black Flag With An Orange Disc', desc: '차량 기계 결함 경고 — 해당 드라이버는 즉시 피트로 복귀.' },
  { bg: 'conic-gradient(#000 0 25%,#fff 0 50%,#000 0 75%,#fff 0)', title: 'Chequered Flag', desc: '세션 종료 — 결승에서 이걸 받으면 그 바퀴로 경기 끝.' },
]

export default function GuideFlags() {
  return (
    <>
      {/* 07. Flag 가 뭐에요? */}
      <section className="bg-bg-alt border-t border-border py-[72px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead num="07" title="플래그 읽기" sub="코스 곳곳에서 플래그로 신호를 줍니다. F1에서 쓰이는 플래그는 모두 11가지예요." />
          <div className="grid gap-3.5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {FLAGS.map((f) => (
              <div key={f.title} className="flex flex-col gap-2.5 bg-white border border-border rounded px-[18px] py-4 h-full box-border">
                <div className="flex items-center gap-3 flex-shrink-0">
                  {f.title === 'Double Yellow Flag' ? (
                    <div className="relative w-[38px] h-7 flex-shrink-0">
                      <div className="absolute top-1 left-1 w-[34px] h-6 rounded-[3px] border border-[rgba(0,0,0,.08)] bg-[#d4a012]" />
                      <div className="absolute top-0 left-0 w-[34px] h-6 rounded-[3px] border border-[rgba(0,0,0,.08)] bg-[#f4c13b]" />
                    </div>
                  ) : (
                    <div className="w-[34px] h-6 rounded-[3px] flex-shrink-0 border border-[rgba(0,0,0,.08)]" style={{ background: f.bg }} />
                  )}
                  <h4 className="font-bold text-[15px] leading-[1.2]">{f.title}</h4>
                </div>
                <p className="text-[13px] text-text-mid leading-[1.55] flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 07-B. 플래그 퀴즈 */}
      <section className="bg-bg-alt pb-[72px]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="pt-12 mb-1">
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-accent mb-2">실력 확인</div>
            <h3 className="font-noto font-black leading-[1.2]" style={{ fontSize: 'clamp(18px,2.4vw,24px)' }}>
              플래그 퀴즈 — 방금 배운 걸 확인해보세요
            </h3>
          </div>
          <FlagQuiz />
        </div>
      </section>
    </>
  )
}
