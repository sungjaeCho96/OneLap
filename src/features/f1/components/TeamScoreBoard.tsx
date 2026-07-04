'use client'

import { useMemo } from 'react'
import type { TeamCarProfile } from '@/features/f1/cornerAnalysis'
import { AXIS_UNITS, axisScore, axisStatus, type AnalysisAxis } from '@/features/f1/cornerAxis'

const CARD_BG = '#1E1A13'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'
const RED = '#E10600'

interface TeamScoreBoardProps {
  teams: TeamCarProfile[]
  axis: AnalysisAxis
  selectedTeam: string
  onSelectTeam: (teamName: string) => void
}

export default function TeamScoreBoard({ teams, axis, selectedTeam, onSelectTeam }: TeamScoreBoardProps) {
  const ranked = useMemo(() => {
    return [...teams].sort((a, b) => {
      const scoreA = axisScore(a, axis)
      const scoreB = axisScore(b, axis)
      if (scoreA == null && scoreB == null) return 0
      if (scoreA == null) return 1
      if (scoreB == null) return -1
      return scoreB - scoreA
    })
  }, [teams, axis])

  return (
    <div
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        background: CARD_BG,
        overflow: 'clip',
      }}
    >
      <div
        style={{
          padding: '12px 14px',
          borderBottom: `1px solid ${BORDER}`,
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: RED,
        }}
      >
        팀 순위
      </div>

      <div>
        {ranked.map((team, i) => {
          const score = axisScore(team, axis)
          const status = axisStatus(team, axis)
          const isSelected = team.teamName === selectedTeam

          return (
            <button
              key={team.teamName}
              onClick={() => onSelectTeam(team.teamName)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                textAlign: 'left',
                padding: '10px 14px',
                background: isSelected ? 'rgba(225,6,0,0.1)' : 'transparent',
                border: 'none',
                borderBottom: `1px solid ${BORDER}`,
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  color: MUTED,
                  width: 16,
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: team.teamColour,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: isSelected ? 700 : 400,
                  color: isSelected ? TEXT : MUTED,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {team.teamName}
              </span>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 12,
                  fontWeight: 700,
                  color: TEXT,
                  flexShrink: 0,
                }}
              >
                {score != null ? `${score.toFixed(1)}${AXIS_UNITS[axis]}` : '—'}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0, alignItems: 'flex-end' }}>
                {!team.meetsLapThreshold && <Badge label="랩 수 부족" />}
                {team.meetsLapThreshold && status === 'INSUFFICIENT_SAMPLE' && <Badge label="분석 불가" />}
                {team.isSingleDriver && <Badge label="1인 데이터" muted />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Badge({ label, muted }: { label: string; muted?: boolean }) {
  return (
    <span
      style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9,
        letterSpacing: '0.04em',
        padding: '2px 6px',
        borderRadius: 2,
        color: muted ? MUTED : RED,
        background: muted ? 'rgba(133,122,106,0.12)' : 'rgba(225,6,0,0.1)',
        border: `1px solid ${muted ? 'rgba(133,122,106,0.3)' : 'rgba(225,6,0,0.3)'}`,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}
