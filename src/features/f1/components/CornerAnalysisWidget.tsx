'use client'

import { useReducer, useEffect, useState } from 'react'
import type { RaceSession } from '@/features/f1/pitStrategy'
import type { CornerAnalysisData } from '@/features/f1/cornerAnalysisBuild'
import { AXIS_LABELS, pickDefaultTeam, type AnalysisAxis } from '@/features/f1/cornerAxis'
import CornerTrackMap from './CornerTrackMap'
import TeamScoreBoard from './TeamScoreBoard'
import TeamCornerPanel from './TeamCornerPanel'

const BG = '#15120D'
const CARD_BG = '#1E1A13'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'
const RED = '#E10600'

// ─── State machine ────────────────────────────────────────────────────────────

type State =
  | { phase: 'idle'; selectedKey: null }
  | { phase: 'loading'; selectedKey: number }
  | { phase: 'ready'; selectedKey: number; data: CornerAnalysisData; selectedTeam: string; axis: AnalysisAxis }
  | { phase: 'error'; selectedKey: number | null; message: string }

type Action =
  | { type: 'SELECT_RACE'; sessionKey: number }
  | { type: 'DATA_LOADED'; data: CornerAnalysisData }
  | { type: 'SET_ERROR'; message: string }
  | { type: 'SELECT_TEAM'; teamName: string }
  | { type: 'SET_AXIS'; axis: AnalysisAxis }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SELECT_RACE':
      if (state.selectedKey === action.sessionKey) return state
      return { phase: 'loading', selectedKey: action.sessionKey }

    case 'DATA_LOADED':
      if (state.phase !== 'loading') return state
      return {
        phase: 'ready',
        selectedKey: state.selectedKey,
        data: action.data,
        selectedTeam: pickDefaultTeam(action.data.teams),
        axis: 'aero',
      }

    case 'SET_ERROR':
      return { phase: 'error', selectedKey: state.selectedKey ?? null, message: action.message }

    case 'SELECT_TEAM':
      if (state.phase !== 'ready') return state
      return { ...state, selectedTeam: action.teamName }

    case 'SET_AXIS':
      if (state.phase !== 'ready') return state
      return { ...state, axis: action.axis }

    default:
      return state
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CornerAnalysisWidgetProps {
  races: readonly RaceSession[]
}

export default function CornerAnalysisWidget({ races }: CornerAnalysisWidgetProps) {
  const [state, dispatch] = useReducer(reducer, { phase: 'idle', selectedKey: null } as State)
  const [pickedCornerIndex, setPickedCornerIndex] = useState<number | null>(null)

  const loadingKey = state.phase === 'loading' ? state.selectedKey : null

  useEffect(() => {
    if (!loadingKey) return

    const controller = new AbortController()
    fetch(`/api/f1/corner-analysis?session_key=${loadingKey}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((body: { success: boolean; data?: CornerAnalysisData; error?: string }) => {
        if (!body.success || !body.data) {
          dispatch({ type: 'SET_ERROR', message: body.error ?? '코너 분석 데이터 로딩 실패' })
        } else {
          dispatch({ type: 'DATA_LOADED', data: body.data })
        }
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== 'AbortError') {
          dispatch({ type: 'SET_ERROR', message: '코너 분석 데이터를 불러오지 못했습니다.' })
        }
      })

    return () => controller.abort()
  }, [loadingKey])

  const pickedCorner =
    state.phase === 'ready' ? state.data.corners.find((c) => c.index === pickedCornerIndex) ?? null : null

  return (
    <section
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        overflow: 'hidden',
        background: CARD_BG,
        color: TEXT,
      }}
    >
      {/* 레이스 선택 */}
      <div style={{ padding: 20, borderBottom: `1px solid ${BORDER}`, background: BG }}>
        <label
          htmlFor="corner-race-select"
          style={{
            display: 'block',
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: MUTED,
            marginBottom: 8,
          }}
        >
          레이스 선택
        </label>
        <select
          id="corner-race-select"
          value={state.selectedKey ?? ''}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10)
            if (isNaN(val)) return
            setPickedCornerIndex(null)
            dispatch({ type: 'SELECT_RACE', sessionKey: val })
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

        {state.phase === 'ready' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginTop: 16 }}>
            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: MUTED,
                  marginBottom: 8,
                }}
              >
                팀 선택
              </div>
              <select
                value={state.selectedTeam}
                onChange={(e) => dispatch({ type: 'SELECT_TEAM', teamName: e.target.value })}
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
                  minWidth: 220,
                }}
              >
                {state.data.teams.map((team) => (
                  <option key={team.teamName} value={team.teamName}>
                    {team.teamName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: MUTED,
                  marginBottom: 8,
                }}
              >
                분석 축
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {(Object.keys(AXIS_LABELS) as AnalysisAxis[]).map((axis) => {
                  const isActive = state.axis === axis
                  return (
                    <button
                      key={axis}
                      onClick={() => dispatch({ type: 'SET_AXIS', axis })}
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        padding: '9px 14px',
                        borderRadius: 2,
                        cursor: 'pointer',
                        color: isActive ? '#fff' : MUTED,
                        background: isActive ? RED : 'transparent',
                        border: `1px solid ${isActive ? RED : BORDER}`,
                      }}
                    >
                      {AXIS_LABELS[axis]}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: 24 }}>
        {state.phase === 'idle' && (
          <div
            style={{
              padding: '40px 24px',
              textAlign: 'center',
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              color: MUTED,
            }}
          >
            레이스를 선택하면 팀별 코너 강점을 확인할 수 있습니다.
          </div>
        )}

        {state.phase === 'loading' && (
          <div
            style={{
              padding: '40px 24px',
              textAlign: 'center',
              fontFamily: "'Space Mono', monospace",
              fontSize: 13,
              color: MUTED,
              lineHeight: 1.7,
            }}
          >
            코너 분석 데이터를 불러오는 중… (최초 조회 시 다소 시간이 걸릴 수 있어요)
          </div>
        )}

        {state.phase === 'error' && (
          <div
            style={{
              padding: '24px',
              border: '1px solid rgba(225,6,0,0.3)',
              borderRadius: 4,
              background: 'rgba(225,6,0,0.06)',
            }}
          >
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: RED, marginBottom: 12 }}>
              {state.message}
            </div>
            <button
              onClick={() => {
                if (state.selectedKey !== null) dispatch({ type: 'SELECT_RACE', sessionKey: state.selectedKey })
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
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr minmax(280px, 340px)',
                gap: 20,
                alignItems: 'start',
              }}
            >
              <div style={{ aspectRatio: '1 / 1', minHeight: 320 }}>
                <CornerTrackMap
                  data={state.data}
                  selectedTeam={state.selectedTeam}
                  axis={state.axis}
                  onPickCorner={setPickedCornerIndex}
                  pickedCornerIndex={pickedCornerIndex}
                />
              </div>
              <div style={{ position: 'sticky', top: 120 }}>
                <TeamScoreBoard
                  teams={state.data.teams}
                  axis={state.axis}
                  selectedTeam={state.selectedTeam}
                  onSelectTeam={(teamName) => dispatch({ type: 'SELECT_TEAM', teamName })}
                />
              </div>
            </div>

            {pickedCorner && (
              <TeamCornerPanel corner={pickedCorner} teams={state.data.teams} selectedTeam={state.selectedTeam} />
            )}
          </>
        )}
      </div>
    </section>
  )
}
