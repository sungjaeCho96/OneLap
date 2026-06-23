'use client'

import { useState } from 'react'

const RED = '#E10600'

const FLAGS = [
  {
    id: 'yellow',
    bg: '#f4c13b',
    title: '황색기',
    situation: '코너 직전에서 차가 멈춰 서 있습니다. 다른 드라이버들에게 위험을 알려야 합니다.',
    desc: '전방에 위험. 속도를 줄이고 추월 금지.',
  },
  {
    id: 'red',
    bg: '#ff2e55',
    title: '적색기',
    situation: '심각한 사고로 코스에 잔해가 흩어져 있어 더 이상 주행이 불가능합니다.',
    desc: '세션 중단. 모두 피트로 복귀해야 합니다.',
  },
  {
    id: 'blue',
    bg: '#3aa0ff',
    title: '청색기',
    situation: '선두권 차량이 한 바퀴 앞서 달려오고 있고, 이 드라이버를 곧 따라잡을 것입니다.',
    desc: '더 빠른 차가 따라온다 — 추월당하는 쪽은 길을 비켜야 함.',
  },
  {
    id: 'bw',
    bg: 'linear-gradient(135deg,#111 0 50%,#fff 50% 100%)',
    title: '흑백기',
    situation: '이 드라이버가 방어 라인을 여러 차례 바꾸며 반칙에 가까운 주행을 했습니다.',
    desc: '비신사적 행위에 대한 경고(옐로카드 같은 개념).',
  },
  {
    id: 'green',
    bg: 'linear-gradient(135deg,#111 0 50%,#0a0 50% 100%)',
    title: '녹색기',
    situation: '황색기 구간의 사고 처리가 끝났습니다. 드라이버들에게 정상 주행 재개를 알려야 합니다.',
    desc: '위험 해제 — 다시 정상 주행·추월 가능.',
  },
  {
    id: 'checker',
    bg: 'conic-gradient(#000 0 25%,#fff 0 50%,#000 0 75%,#fff 0)',
    title: '체커기',
    situation: '선두 차량이 정해진 바퀴 수를 모두 완주했습니다.',
    desc: '세션 종료. 결승에서 이걸 받으면 그 바퀴로 경기 끝.',
  },
] as const

type FlagId = (typeof FLAGS)[number]['id']
type QuizType = 'show-flag' | 'show-situation'

interface Question {
  type: QuizType
  answerId: FlagId
  choices: FlagId[]
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

function generateQuestions(): Question[] {
  const flagIds = FLAGS.map((f) => f.id) as FlagId[]
  const shuffledFlags = shuffle(flagIds)

  return shuffledFlags.map((answerId, i) => {
    const type: QuizType = i % 2 === 0 ? 'show-flag' : 'show-situation'
    const wrongChoices = shuffle(flagIds.filter((id) => id !== answerId)).slice(0, 3)
    const choices = shuffle([answerId, ...wrongChoices]) as FlagId[]
    return { type, answerId, choices }
  })
}

function FlagSwatch({ flagId, size = 32 }: { flagId: FlagId; size?: number }) {
  const flag = FLAGS.find((f) => f.id === flagId)!
  return (
    <div
      style={{
        width: size,
        height: Math.round(size * 0.68),
        borderRadius: 2,
        background: flag.bg,
        border: '1px solid rgba(0,0,0,.1)',
        flexShrink: 0,
      }}
    />
  )
}

export default function FlagQuiz() {
  const [questions, setQuestions] = useState<Question[]>(() => generateQuestions())
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<FlagId | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = questions[currentIdx]
  const answered = selected !== null
  const isCorrect = selected === q?.answerId
  const answerFlag = FLAGS.find((f) => f.id === q?.answerId)!

  function handleSelect(id: FlagId) {
    if (answered) return
    setSelected(id)
    if (id === q.answerId) setScore((s) => s + 1)
  }

  function handleNext() {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((i) => i + 1)
      setSelected(null)
    } else {
      setDone(true)
    }
  }

  function handleReset() {
    setQuestions(generateQuestions())
    setCurrentIdx(0)
    setSelected(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct === 100 ? '🏆' : pct >= 66 ? '🎉' : pct >= 33 ? '👍' : '📚'
    return (
      <div style={{ marginTop: 32, border: '1px solid #E0D9CB', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ background: '#15120D', padding: '12px 20px' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#9A9081', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            FLAG QUIZ · 결과
          </span>
        </div>
        <div style={{ padding: '48px 32px', textAlign: 'center', background: '#fff' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</div>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 56, lineHeight: 1, color: pct === 100 ? '#2fd27a' : pct >= 66 ? '#f4c13b' : RED }}>
            {score} / {questions.length}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#857A6A', marginTop: 8, marginBottom: 24, letterSpacing: '0.08em' }}>
            정답률 {pct}%
          </div>
          <p style={{ fontSize: 15, color: '#4A4338', lineHeight: 1.65, maxWidth: '36ch', margin: '0 auto 28px' }}>
            {pct === 100
              ? '완벽합니다! 플래그를 완전히 마스터했어요.'
              : pct >= 66
              ? '잘 했어요! 헷갈리는 플래그만 다시 확인해보세요.'
              : pct >= 33
              ? '위의 플래그 표를 다시 보고 재도전해보세요.'
              : '걱정 마세요. 위의 플래그 섹션을 한 번 더 읽고 도전해보세요.'}
          </p>
          <button
            onClick={handleReset}
            style={{
              fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: '#fff', background: RED, border: 'none',
              padding: '12px 28px', cursor: 'pointer', borderRadius: 2,
            }}
          >
            다시 도전하기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginTop: 32, border: '1px solid #E0D9CB', borderRadius: 4, overflow: 'hidden' }}>

      {/* 헤더 */}
      <div style={{ background: '#15120D', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#9A9081', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          FLAG QUIZ
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {questions.map((_, i) => (
            <div
              key={i}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: i < currentIdx ? '#2fd27a' : i === currentIdx ? RED : '#3A352C',
                transition: 'background 0.2s',
              }}
            />
          ))}
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#4A3F35', marginLeft: 4 }}>
            {currentIdx + 1}/{questions.length}
          </span>
        </div>
      </div>

      <div style={{ padding: 24, background: '#fff' }}>

        {/* 문제 */}
        {q.type === 'show-flag' ? (
          <>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
              이 플래그는 어떤 의미일까요?
            </p>
            <div style={{
              width: 120, height: 80, borderRadius: 4, marginBottom: 28,
              background: answerFlag.bg,
              border: '1px solid rgba(0,0,0,.1)',
              boxShadow: '0 4px 20px rgba(0,0,0,.08)',
            }} />
          </>
        ) : (
          <>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
              이 상황에서 어떤 플래그를 사용할까요?
            </p>
            <div style={{
              background: '#F2EFE8', borderLeft: `3px solid ${RED}`,
              borderRadius: 2, padding: '14px 18px', marginBottom: 24,
              fontSize: 15, color: '#15120D', lineHeight: 1.65, fontWeight: 500,
              maxWidth: '52ch',
            }}>
              {answerFlag.situation}
            </div>
          </>
        )}

        {/* 선택지 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
          {q.choices.map((choiceId) => {
            const choiceFlag = FLAGS.find((f) => f.id === choiceId)!
            const isSelected = selected === choiceId
            const isAnswer = choiceId === q.answerId

            let borderColor = '#E0D9CB'
            let bgColor = '#F2EFE8'
            let textColor = '#15120D'

            if (answered) {
              if (isAnswer) {
                borderColor = '#2fd27a'
                bgColor = 'rgba(47,210,122,0.07)'
                textColor = '#1a7a46'
              } else if (isSelected) {
                borderColor = RED
                bgColor = 'rgba(225,6,0,0.04)'
                textColor = RED
              }
            }

            return (
              <button
                key={choiceId}
                onClick={() => handleSelect(choiceId)}
                disabled={answered}
                style={{
                  background: bgColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: 4, padding: '14px 16px',
                  cursor: answered ? 'default' : 'pointer',
                  textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 10,
                  transition: 'all 0.15s ease',
                }}
              >
                {q.type === 'show-flag' ? (
                  <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 14, fontWeight: 700, color: textColor }}>
                    {choiceFlag.title}
                  </span>
                ) : (
                  <>
                    <FlagSwatch flagId={choiceId} size={32} />
                    <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 14, fontWeight: 600, color: textColor }}>
                      {choiceFlag.title}
                    </span>
                  </>
                )}
                {answered && isAnswer && (
                  <span style={{ marginLeft: 'auto', color: '#2fd27a', fontSize: 14, fontWeight: 700 }}>✓</span>
                )}
                {answered && isSelected && !isAnswer && (
                  <span style={{ marginLeft: 'auto', color: RED, fontSize: 14, fontWeight: 700 }}>✗</span>
                )}
              </button>
            )
          })}
        </div>

        {/* 피드백 */}
        {answered && (
          <div style={{
            marginTop: 20,
            background: isCorrect ? 'rgba(47,210,122,0.06)' : 'rgba(225,6,0,0.04)',
            border: `1px solid ${isCorrect ? 'rgba(47,210,122,0.35)' : 'rgba(225,6,0,0.2)'}`,
            borderRadius: 4, padding: '16px 20px',
          }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: isCorrect ? '#1a7a46' : RED, marginBottom: 6 }}>
              {isCorrect ? '정답!' : `오답 — 정답은 ${answerFlag.title}`}
            </div>
            <p style={{ fontSize: 14, color: '#4A4338', lineHeight: 1.65, marginBottom: 14 }}>
              {q.type === 'show-flag' ? answerFlag.situation : answerFlag.desc}
            </p>
            <button
              onClick={handleNext}
              style={{
                fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#fff',
                background: isCorrect ? '#1a7a46' : RED,
                border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: 2,
              }}
            >
              {currentIdx < questions.length - 1 ? '다음 문제 →' : '결과 보기 →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
