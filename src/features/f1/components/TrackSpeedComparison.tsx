'use client'

import { useReducer, useEffect } from 'react'
import type { QualifyingSessionOption, DriverOption, TrackSpeedData } from '@/features/f1/trackSpeed'
import { resolveDriverColors } from '@/features/f1/speedColor'
import type { DriverColorPair } from '@/features/f1/speedColor'
import SessionDriverPicker from './SessionDriverPicker'
import TrackMap from './TrackMap'
import SpeedReadout from './SpeedReadout'

// ─── State machine ────────────────────────────────────────────────────────────

type Phase =
  | { phase: 'idle' }
  | { phase: 'driversLoading'; sessionKey: number }
  | { phase: 'selecting'; sessionKey: number; drivers: DriverOption[]; picked: number[] }
  | { phase: 'loading'; sessionKey: number; pair: [number, number] }
  | { phase: 'ready'; data: TrackSpeedData; driverColors: DriverColorPair; cornerD: number | null }
  | { phase: 'error'; message: string }

type Action =
  | { type: 'SELECT_SESSION'; sessionKey: number }
  | { type: 'DRIVERS_LOADED'; drivers: DriverOption[] }
  | { type: 'TOGGLE_DRIVER'; driverNumber: number }
  | { type: 'COMPARE' }
  | { type: 'DATA_LOADED'; data: TrackSpeedData }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'SET_CORNER'; d: number | null }
  | { type: 'RESET' }

function reducer(state: Phase, action: Action): Phase {
  switch (action.type) {
    case 'SELECT_SESSION':
      return { phase: 'driversLoading', sessionKey: action.sessionKey }

    case 'DRIVERS_LOADED':
      if (state.phase !== 'driversLoading') return state
      return { phase: 'selecting', sessionKey: state.sessionKey, drivers: action.drivers, picked: [] }

    case 'TOGGLE_DRIVER': {
      if (state.phase !== 'selecting') return state
      const { picked } = state
      if (picked.includes(action.driverNumber)) {
        return { ...state, picked: picked.filter((n) => n !== action.driverNumber) }
      }
      if (picked.length >= 2) return state
      return { ...state, picked: [...picked, action.driverNumber] }
    }

    case 'COMPARE': {
      if (state.phase !== 'selecting' || state.picked.length < 2) return state
      return {
        phase: 'loading',
        sessionKey: state.sessionKey,
        pair: [state.picked[0], state.picked[1]],
      }
    }

    case 'DATA_LOADED':
      if (state.phase !== 'loading') return state
      return {
        phase: 'ready',
        data: action.data,
        driverColors: resolveDriverColors(
          action.data.drivers[0].teamColour,
          action.data.drivers[1].teamColour,
        ),
        cornerD: null,
      }

    case 'SET_ERROR':
      return { phase: 'error', message: action.message }

    case 'SET_CORNER':
      if (state.phase !== 'ready') return state
      return { ...state, cornerD: action.d }

    case 'RESET':
      return { phase: 'idle' }

    default:
      return state
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface TrackSpeedComparisonProps {
  sessions: QualifyingSessionOption[]
}

export default function TrackSpeedComparison({ sessions }: TrackSpeedComparisonProps) {
  const [state, dispatch] = useReducer(reducer, { phase: 'idle' })

  const sessionKeyForDrivers = state.phase === 'driversLoading' ? state.sessionKey : null
  const sessionKeyForData = state.phase === 'loading' ? state.sessionKey : null
  const pairKey = state.phase === 'loading' ? state.pair.join(',') : null

  // Fetch drivers when a session is selected
  useEffect(() => {
    if (!sessionKeyForDrivers) return

    const controller = new AbortController()
    fetch(`/api/f1/track-speed/drivers?session_key=${sessionKeyForDrivers}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((body: { success: boolean; drivers?: DriverOption[]; error?: string }) => {
        if (!body.success || !body.drivers) {
          dispatch({ type: 'SET_ERROR', message: body.error ?? '드라이버 목록 로딩 실패' })
        } else {
          dispatch({ type: 'DRIVERS_LOADED', drivers: body.drivers })
        }
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== 'AbortError') {
          dispatch({ type: 'SET_ERROR', message: '드라이버 목록을 불러오지 못했습니다.' })
        }
      })

    return () => controller.abort()
  }, [sessionKeyForDrivers])

  // Fetch track data when pair is ready
  useEffect(() => {
    if (!sessionKeyForData || !pairKey) return

    const controller = new AbortController()
    fetch(
      `/api/f1/track-speed?session_key=${sessionKeyForData}&drivers=${pairKey}`,
      { signal: controller.signal },
    )
      .then((r) => r.json())
      .then((body: { success: boolean; data?: TrackSpeedData; error?: string }) => {
        if (!body.success || !body.data) {
          dispatch({ type: 'SET_ERROR', message: body.error ?? '트랙 데이터 로딩 실패' })
        } else {
          dispatch({ type: 'DATA_LOADED', data: body.data })
        }
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== 'AbortError') {
          dispatch({ type: 'SET_ERROR', message: '트랙 데이터를 불러오지 못했습니다.' })
        }
      })

    return () => controller.abort()
  }, [sessionKeyForData, pairKey])

  return (
    <div>
      {/* Header bar */}
      <div
        style={{
          background: '#15120D',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #2C271F',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <StepDot
            n={1}
            label="세션 선택"
            done={state.phase !== 'idle'}
            active={state.phase === 'idle' || state.phase === 'driversLoading'}
          />
          <StepArrow />
          <StepDot
            n={2}
            label="드라이버 선택"
            done={state.phase === 'loading' || state.phase === 'ready'}
            active={state.phase === 'selecting'}
          />
          <StepArrow />
          <StepDot
            n={3}
            label="비교"
            done={false}
            active={state.phase === 'ready'}
          />
        </div>
        {state.phase !== 'idle' && (
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#4A3F35',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            RESET
          </button>
        )}
      </div>

      <div style={{ padding: 24 }}>
        {/* Picker phase */}
        {(state.phase === 'idle' ||
          state.phase === 'driversLoading' ||
          state.phase === 'selecting') && (
          <SessionDriverPicker
            sessions={sessions}
            selectedSessionKey={
              state.phase === 'driversLoading' || state.phase === 'selecting'
                ? state.sessionKey
                : null
            }
            drivers={state.phase === 'selecting' ? state.drivers : []}
            driversLoading={state.phase === 'driversLoading'}
            picked={state.phase === 'selecting' ? state.picked : []}
            onSelectSession={(k) => dispatch({ type: 'SELECT_SESSION', sessionKey: k })}
            onToggleDriver={(n) => dispatch({ type: 'TOGGLE_DRIVER', driverNumber: n })}
            onCompare={() => dispatch({ type: 'COMPARE' })}
          />
        )}

        {/* Loading */}
        {state.phase === 'loading' && (
          <div
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              color: '#857A6A',
              padding: '40px 0',
              textAlign: 'center',
            }}
          >
            패스티스트 랩 데이터 로딩 중…
          </div>
        )}

        {/* Error */}
        {state.phase === 'error' && (
          <div
            style={{
              padding: '24px',
              border: '1px solid rgba(225,6,0,0.3)',
              borderRadius: 4,
              background: 'rgba(225,6,0,0.04)',
            }}
          >
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 13,
                color: '#E10600',
                marginBottom: 12,
              }}
            >
              {state.message}
            </div>
            <button
              onClick={() => dispatch({ type: 'RESET' })}
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#E10600',
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

        {/* Ready: visualization */}
        {state.phase === 'ready' && (
          <div>
            <div
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#857A6A',
                marginBottom: 16,
              }}
            >
              {state.data.circuitShortName} · Qualifying Fastest Laps
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr minmax(240px, 320px)',
                gap: 20,
                alignItems: 'start',
              }}
            >
              <div style={{ aspectRatio: '1 / 1', minHeight: 300 }}>
                <TrackMap
                  data={state.data}
                  driverColors={state.driverColors}
                  hoveredD={state.cornerD}
                  onHover={(d) => dispatch({ type: 'SET_CORNER', d })}
                  onPick={(d) => dispatch({ type: 'SET_CORNER', d })}
                />
              </div>
              <SpeedReadout
                data={state.data}
                driverColors={state.driverColors}
                cornerD={state.cornerD}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Step indicator sub-components ───────────────────────────────────────────

interface StepDotProps {
  n: number
  label: string
  done: boolean
  active: boolean
}

function StepDot({ n, label, done, active }: StepDotProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          flexShrink: 0,
          background: done ? '#2fd27a' : active ? '#E10600' : 'transparent',
          border: `1px solid ${done ? '#2fd27a' : active ? '#E10600' : '#3A352C'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          fontWeight: 700,
          color: '#fff',
        }}
      >
        {done ? '✓' : n}
      </span>
      <span
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 11,
          letterSpacing: '0.04em',
          color: active ? '#fff' : '#4A3F35',
        }}
      >
        {label}
      </span>
    </div>
  )
}

function StepArrow() {
  return <span style={{ color: '#3A352C', margin: '0 4px' }}>›</span>
}
