'use client'

import { useState, useEffect } from 'react'

const RED = '#E10600'

const FLAGS = [
  {
    id: 'green',
    bg: '#2fd27a',
    title: 'Green Flag',
    situation: '황색기 구간의 위험이 해제됐습니다. 드라이버들에게 정상 주행 재개를 알려야 합니다.',
    desc: '위험 해제 — 정상 주행·추월 가능.',
  },
  {
    id: 'yellow',
    bg: '#f4c13b',
    title: 'Yellow Flag',
    situation: '코너 직전에서 차가 스핀해 멈춰 섰습니다. 다른 드라이버들에게 위험을 알려야 합니다.',
    desc: '전방 위험 — 속도를 줄이고 추월 금지.',
  },
  {
    id: 'double-yellow',
    bg: 'linear-gradient(90deg, #f4c13b calc(50% - 1.5px), #a07000 calc(50% - 1.5px), #a07000 calc(50% + 1.5px), #f4c13b calc(50% + 1.5px))',
    title: 'Double Yellow Flag',
    situation: '코스 위에 마샬이 나와 있는 긴급 상황입니다. 드라이버들은 즉각 감속하고 정지 준비를 해야 합니다.',
    desc: '즉각 감속·추월 절대 금지 — 정지 준비. 황색기보다 훨씬 위험한 상황.',
  },
  {
    id: 'red',
    bg: '#ff2e55',
    title: 'Red Flag',
    situation: '심각한 사고로 코스에 잔해가 흩어져 있어 더 이상 주행이 불가능합니다.',
    desc: '세션 중단 — 모두 즉시 피트로 복귀.',
  },
  {
    id: 'blue',
    bg: '#3aa0ff',
    title: 'Blue Flag',
    situation: '선두권 차량이 랩 다운인 이 드라이버를 추월하려 바짝 따라붙었습니다.',
    desc: '선두권 차량 접근 — 랩 다운 드라이버는 길을 비켜야 함.',
  },
  {
    id: 'black',
    bg: '#1a1a1a',
    title: 'Black Flag',
    situation: '이 드라이버가 반복된 위험 주행으로 실격 판정을 받았습니다. 피트로 즉시 복귀 명령입니다.',
    desc: '실격 또는 피트 복귀 명령 — 해당 드라이버에게만 제시.',
  },
  {
    id: 'white',
    bg: '#f0f0f0',
    title: 'White Flag',
    situation: '코스에 의료 차량이나 구급차가 천천히 주행 중입니다.',
    desc: '코스 위에 느린 차량(의료·안전) 존재 — 주의 요망.',
  },
  {
    id: 'bw',
    bg: 'linear-gradient(135deg, #1a1a1a 0 50%, #fff 50% 100%)',
    title: 'Black & White Flag',
    situation: '이 드라이버가 방어 라인을 여러 차례 바꾸며 비신사적 주행을 했습니다.',
    desc: '비신사적 행위 경고 — 옐로카드와 같은 개념. 이후 흑색기로 이어질 수 있음.',
  },
  {
    id: 'yellow-red',
    bg: 'repeating-linear-gradient(90deg, #f4c13b 0px, #f4c13b 5px, #ff2e55 5px, #ff2e55 9px)',
    title: 'Yellow & Red Striped Flag',
    situation: '앞 차에서 기름이 새어 코스 노면이 미끄러운 상태입니다.',
    desc: '노면 변화 경고 — 기름·물·잔해로 미끄러울 수 있음.',
  },
  {
    id: 'black-orange',
    bg: 'radial-gradient(circle at 50% 50%, #ff8c00 0% 30%, #1a1a1a 30% 100%)',
    title: 'Black Flag / Orange Circle',
    situation: '이 드라이버의 차량에 기계적 결함이 발견됐습니다. 다른 차량에 위험이 될 수 있어 즉시 피트로 복귀해야 합니다.',
    desc: '차량 기계 결함 경고 — 해당 드라이버는 즉시 피트로 복귀.',
  },
  {
    id: 'checker',
    bg: 'conic-gradient(#000 0 25%, #fff 0 50%, #000 0 75%, #fff 0)',
    title: 'Chequered Flag',
    situation: '선두 차량이 정해진 바퀴 수를 모두 완주했습니다.',
    desc: '세션 종료 — 결승에서 이걸 받으면 그 바퀴로 경기 끝.',
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
  const h = Math.round(size * 0.68)
  const offset = Math.round(size * 0.14)

  if (flagId === 'double-yellow') {
    return (
      <div style={{ position: 'relative', width: size + offset, height: h + offset, flexShrink: 0 }}>
        <div style={{ position: 'absolute', top: offset, left: offset, width: size, height: h, background: '#d4a012', borderRadius: 2, border: '1px solid rgba(0,0,0,.12)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: size, height: h, background: '#f4c13b', borderRadius: 2, border: '1px solid rgba(0,0,0,.12)' }} />
      </div>
    )
  }

  return (
    <div style={{ width: size, height: h, borderRadius: 2, background: flag.bg, border: '1px solid rgba(0,0,0,.12)', flexShrink: 0 }} />
  )
}

export default function FlagQuiz() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<FlagId | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => { setQuestions(generateQuestions()) }, [])

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

  if (questions.length === 0) {
    return (
      <div style={{ marginTop: 32, border: '1px solid #E0D9CB', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ background: '#15120D', padding: '12px 20px' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#9A9081', letterSpacing: '0.1em', textTransform: 'uppercase' }}>FLAG QUIZ</span>
        </div>
        <div style={{ padding: 24, background: '#fff', minHeight: 200 }} />
      </div>
    )
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const emoji = pct === 100 ? '🏆' : pct >= 72 ? '🎉' : pct >= 45 ? '👍' : '📚'
    return (
      <div style={{ marginTop: 32, border: '1px solid #E0D9CB', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ background: '#15120D', padding: '12px 20px' }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#9A9081', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            FLAG QUIZ · 결과
          </span>
        </div>
        <div style={{ padding: '48px 32px', textAlign: 'center', background: '#fff' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</div>
          <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 56, lineHeight: 1, color: pct === 100 ? '#2fd27a' : pct >= 72 ? '#f4c13b' : RED }}>
            {score} / {questions.length}
          </div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#857A6A', marginTop: 8, marginBottom: 24, letterSpacing: '0.08em' }}>
            정답률 {pct}%
          </div>
          <p style={{ fontSize: 15, color: '#4A4338', lineHeight: 1.65, maxWidth: '36ch', margin: '0 auto 28px' }}>
            {pct === 100
              ? '완벽합니다! 11개 플래그를 모두 마스터했어요.'
              : pct >= 72
              ? '잘 했어요! 헷갈리는 플래그만 다시 확인해보세요.'
              : pct >= 45
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
          FLAG QUIZ · {questions.length}문제
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {questions.map((_, i) => (
            <div
              key={i}
              style={{
                width: 7, height: 7, borderRadius: '50%',
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
            {q.answerId === 'double-yellow' ? (
              <div style={{ position: 'relative', width: 132, height: 92, marginBottom: 28 }}>
                <div style={{ position: 'absolute', top: 12, left: 12, width: 120, height: 80, background: '#d4a012', borderRadius: 4, border: '1px solid rgba(0,0,0,.12)' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: 120, height: 80, background: '#f4c13b', borderRadius: 4, border: '1px solid rgba(0,0,0,.12)', boxShadow: '0 4px 20px rgba(0,0,0,.08)' }} />
              </div>
            ) : (
              <div style={{ width: 120, height: 80, borderRadius: 4, marginBottom: 28, background: answerFlag.bg, border: '1px solid rgba(0,0,0,.12)', boxShadow: '0 4px 20px rgba(0,0,0,.08)' }} />
            )}
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
              {q.type === 'show-flag' ? answerFlag.desc : answerFlag.desc}
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
