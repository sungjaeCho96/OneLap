'use client'

import { useMemo } from 'react'
import type { CornerDef, TeamCarProfile } from '@/features/f1/cornerAnalysis'
import { CORNER_TYPE_LABELS } from '@/features/f1/cornerAxis'

const CARD_BG = '#1E1A13'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'
const RED = '#E10600'

interface TeamCornerPanelProps {
  corner: CornerDef
  teams: TeamCarProfile[]
  selectedTeam: string
}

export default function TeamCornerPanel({ corner, teams, selectedTeam }: TeamCornerPanelProps) {
  const ranking = useMemo(() => {
    const withValue = teams
      .map((team) => ({
        teamName: team.teamName,
        value: team.corners.find((m) => m.cornerIndex === corner.index)?.apexSpeedMedian ?? null,
      }))
      .filter((entry): entry is { teamName: string; value: number } => entry.value != null)
      .sort((a, b) => b.value - a.value)

    const rank = withValue.findIndex((entry) => entry.teamName === selectedTeam)
    return { total: withValue.length, rank: rank >= 0 ? rank + 1 : null }
  }, [teams, corner.index, selectedTeam])

  const team = teams.find((t) => t.teamName === selectedTeam)
  const metric = team?.corners.find((m) => m.cornerIndex === corner.index)

  return (
    <div
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: 4,
        background: CARD_BG,
        padding: '18px 20px',
        marginTop: 20,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: RED,
          marginBottom: 8,
        }}
      >
        코너 {corner.index} · {CORNER_TYPE_LABELS[corner.type]} 코너
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        <Stat label="기준 apex 속도" value={`${corner.refApexSpeed.toFixed(1)} km/h`} />

        <Stat
          label={`${selectedTeam} apex 속도`}
          value={metric?.apexSpeedMedian != null ? `${metric.apexSpeedMedian.toFixed(1)} km/h` : '표본 부족'}
          sub={
            metric?.apexSpeedMedian != null
              ? metric.soloDriverCode
                ? `${metric.soloDriverCode} 단독 기록 (1인 데이터)`
                : '2인 평균'
              : undefined
          }
        />

        <Stat
          label="필드 순위"
          value={ranking.rank != null ? `${ranking.rank}위 / ${ranking.total}팀` : '순위 없음'}
        />
      </div>
    </div>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <div
        style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.04em',
          color: MUTED,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 16, fontWeight: 700, color: TEXT }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}
