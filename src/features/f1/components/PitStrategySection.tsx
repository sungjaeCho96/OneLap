'use client'

import { useReducer, useEffect } from 'react'
import type { RaceSession, PitStrategyData } from '@/features/f1/pitStrategy'
import StintChart from './StintChart'
import PitStrategyLegend from './PitStrategyLegend'
import PitDuelPanel from './PitDuelPanel'

const BG = '#15120D'
const CARD_BG = '#1E1A13'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'
const RED = '#E10600'

interface PitStrategySectionProps {
  races: readonly RaceSession[]
  initialData: PitStrategyData | null
}

// ─── State machine ────────────────────────────────────────────────────────────

type State =
  | { phase: 'idle'; selectedKey: null }
  | { phase: 'loading'; selectedKey: number }
  | { phase: 'ready'; selectedKey: number; data: PitStrategyData }
  | { phase: 'error'; selectedKey: number | null; message: string }

type Action =
  | { type: 'SELECT_RACE'; sessionKey: number; cachedData?: PitStrategyData }
  | { type: 'DATA_LOADED'; data: PitStrategyData }
  | { type: 'SET_ERROR'; message: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_RACE':
      if (state.selectedKey === action.sessionKey) return state
      if (action.cachedData) {
        return { phase: 'ready', selectedKey: action.sessionKey, data: action.cachedData }
      }
      return { phase: 'loading', selectedKey: action.sessionKey }

    case 'DATA_LOADED':
      if (state.phase !== 'loading') return state
      return { phase: 'ready', selectedKey: state.selectedKey, data: action.data }

    case 'SET_ERROR':
      return { phase: 'error', selectedKey: state.selectedKey ?? null, message: action.message }

    default:
      return state
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PitStrategySection({ races, initialData }: PitStrategySectionProps) {
  const [state, dispatch] = useReducer(reducer, { phase: 'idle', selectedKey: null } as State)
  const prefetchedKey = races.at(-1)?.sessionKey ?? null

  const loadingKey = state.phase === 'loading' ? state.selectedKey : null

  useEffect(() => {
    if (!loadingKey) return

    const controller = new AbortController()

    fetch(`/api/f1/pit-strategy?session_key=${loadingKey}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((body: { success: boolean; data?: PitStrategyData; error?: string }) => {
        if (!body.success || !body.data) {
          dispatch({ type: 'SET_ERROR', message: body.error ?? '피트 데이터 로딩 실패' })
        } else {
          dispatch({ type: 'DATA_LOADED', data: body.data })
        }
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== 'AbortError') {
          dispatch({ type: 'SET_ERROR', message: '피트 스톱 데이터를 불러오지 못했습니다.' })
        }
      })

    return () => controller.abort()
  }, [loadingKey])

  return (
    <section
      id="pit-strategy"
      style={{
        background: BG,
        padding: '64px 0',
        borderBottom: `1px solid ${BORDER}`,
        color: TEXT,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* 섹션 헤더 */}
        <div style={{ marginBottom: 32 }}>
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: RED,
              marginBottom: 12,
            }}
          >
            PIT STRATEGY
          </div>
          <h2
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(28px,4vw,48px)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase' as const,
              color: TEXT,
              marginBottom: 14,
            }}
          >
            피트스톱 전략
          </h2>
          <p style={{ fontSize: 15, color: MUTED, maxWidth: '56ch', lineHeight: 1.65 }}>
            레이스별 드라이버 피트스톱 전략을 한눈에 확인하세요. 각 색상은 장착한 타이어
            컴파운드를 나타내며, 색이 바뀌는 지점이 피트스톱 타이밍입니다.
          </p>
        </div>

        {/* 레이스 선택 드롭다운 */}
        <div style={{ marginBottom: 20 }}>
          <label
            htmlFor="pit-race-select"
            style={{
              display: 'block',
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: MUTED,
              marginBottom: 8,
            }}
          >
            레이스 선택
          </label>
          <select
            id="pit-race-select"
            value={state.selectedKey ?? ''}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10)
              if (isNaN(val)) return
              const cachedData =
                val === prefetchedKey && initialData ? initialData : undefined
              dispatch({ type: 'SELECT_RACE', sessionKey: val, cachedData })
            }}
            style={{
              padding: '10px 14px',
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 2,
              color: TEXT,
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              cursor: 'pointer',
              appearance: 'none' as const,
              minWidth: 280,
            }}
          >
            <option value="" disabled hidden>
              레이스 선택
            </option>
            {races.map((race) => {
              const date = new Date(race.dateStart)
              const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
              return (
                <option key={race.sessionKey} value={race.sessionKey}>
                  R{race.round} {race.circuitShortName} · {race.countryName} ({dateStr})
                </option>
              )
            })}
          </select>
        </div>

        {/* 위젯 */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 4,
            overflow: 'hidden',
            background: CARD_BG,
          }}
        >
          {state.phase === 'loading' && (
            <div
              style={{
                padding: '40px 24px',
                textAlign: 'center',
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                color: TEXT,
              }}
            >
              피트 스톱 데이터 로딩 중…
            </div>
          )}

          {state.phase === 'error' && (
            <div
              style={{
                padding: '24px',
                border: '1px solid rgba(225,6,0,0.3)',
                borderRadius: 4,
                background: 'rgba(225,6,0,0.06)',
                margin: 16,
              }}
            >
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 13,
                  color: RED,
                  marginBottom: 12,
                }}
              >
                {state.message}
              </div>
              <button
                onClick={() => {
                  if (state.selectedKey !== null) {
                    dispatch({ type: 'SELECT_RACE', sessionKey: state.selectedKey })
                  }
                }}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase' as const,
                  color: RED,
                  background: 'none',
                  border: '1px solid rgba(225,6,0,0.35)',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  borderRadius: 2,
                }}
              >
                다시 시도
              </button>
            </div>
          )}

          {state.phase === 'ready' && (
            <>
              <StintChart data={state.data} />
              <PitDuelPanel duels={state.data.duels} drivers={state.data.drivers} />
            </>
          )}

          {state.phase === 'idle' && (
            <div
              style={{
                padding: '40px 24px',
                textAlign: 'center',
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                color: TEXT,
              }}
            >
              레이스를 선택하면 피트 전략을 확인할 수 있습니다.
            </div>
          )}

          {/* 범례 */}
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: '0 20px 20px' }}>
            <PitStrategyLegend />
          </div>
        </div>
      </div>
    </section>
  )
}
