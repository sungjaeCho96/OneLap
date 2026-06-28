'use client'

import { useState } from 'react'
import type { F1RaceResult, F1DriverResult } from '@/features/f1/api'

const RED = '#E10600'
const DARK = '#15120D'
const BG = '#F2EFE8'

const TEAM_COLORS: Record<string, string> = {
  'Mercedes': '#00D2BE',
  'Ferrari': '#E8002D',
  'Red Bull': '#3671C6',
  'McLaren': '#FF8000',
  'Aston Martin': '#358C75',
  'Alpine F1 Team': '#0093CC',
  'Williams': '#64C4FF',
  'RB F1 Team': '#6692FF',
  'Haas F1 Team': '#B6BABD',
  'Audi': '#C5B830',
  'Cadillac F1 Team': '#B40000',
}

function teamColor(team: string): string {
  return TEAM_COLORS[team] ?? '#857A6A'
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`
}

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr)
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function winnerOf(race: F1RaceResult): F1DriverResult | undefined {
  return race.results.find((r) => r.pos === 1)
}

function PosChangeBadge({ change }: { change: number }) {
  if (change === 0) return (
    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A' }}>—</span>
  )
  const up = change > 0
  return (
    <span style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: 11,
      fontWeight: 700,
      color: up ? '#2fd27a' : '#ff4d4d',
    }}>
      {up ? `▲${change}` : `▼${Math.abs(change)}`}
    </span>
  )
}

function RaceListItem({
  race,
  selected,
  onSelect,
}: {
  race: F1RaceResult
  selected: boolean
  onSelect: () => void
}) {
  const winner = winnerOf(race)
  const tc = winner ? teamColor(winner.team) : '#857A6A'
  return (
    <button
      onClick={onSelect}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        background: selected ? DARK : '#fff',
        color: selected ? BG : DARK,
        border: 'none',
        borderLeft: `3px solid ${selected ? RED : 'transparent'}`,
        borderBottom: '1px solid #E0D9CB',
        padding: '14px 16px',
        transition: 'background 0.12s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 6 }}>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.12em',
          color: selected ? RED : '#857A6A',
        }}>
          ROUND {race.round}
        </span>
        <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          color: selected ? '#9A9081' : '#857A6A',
        }}>
          {formatShortDate(race.date)}
        </span>
      </div>
      <div style={{
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 900,
        fontSize: 14,
        lineHeight: 1.05,
        letterSpacing: '-0.01em',
        textTransform: 'uppercase',
        marginBottom: 8,
      }}>
        {race.raceName}
      </div>
      {winner && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: tc, flexShrink: 0, display: 'inline-block' }} />
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            color: selected ? BG : DARK,
          }}>
            {winner.code}
          </span>
          <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: selected ? '#9A9081' : '#857A6A',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {winner.team}
          </span>
        </div>
      )}
    </button>
  )
}

function PodiumCard({ d, index }: { d: F1DriverResult; index: number }) {
  const isWinner = index === 0
  const tc = teamColor(d.team)
  return (
    <div style={{
      background: isWinner ? DARK : '#fff',
      color: isWinner ? BG : DARK,
      padding: '24px 20px',
      borderTop: `3px solid ${isWinner ? RED : tc}`,
      position: 'relative',
    }}>
      <div style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 56, lineHeight: 0.85, opacity: 0.08, position: 'absolute', right: 16, top: 14 }}>
        P{d.pos}
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.12em', color: isWinner ? RED : '#857A6A', marginBottom: 12 }}>
        P{d.pos}
      </div>
      <div style={{ marginBottom: 4 }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 22 }}>{d.code}</span>
        {d.fastestLap && (
          <span style={{ marginLeft: 8, fontSize: 12, color: '#b45cff' }}>⚡FL</span>
        )}
      </div>
      <div style={{ fontSize: 13, color: isWinner ? '#C9C1B2' : '#4A4338', marginBottom: 12, lineHeight: 1.3 }}>
        {d.firstName} {d.lastName}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: tc, flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: isWinner ? '#9A9081' : '#857A6A' }}>{d.team}</span>
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, fontWeight: 700, marginTop: 14, color: isWinner ? BG : DARK }}>
        {index === 0 ? d.time : d.time ? `+${d.time}` : d.status}
      </div>
      <div style={{ marginTop: 8 }}>
        <PosChangeBadge change={d.posChange} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: isWinner ? '#6b6457' : '#C9C1B2', marginLeft: 5 }}>
          (그리드 P{d.grid})
        </span>
      </div>
    </div>
  )
}

const TABLE_COLS = '36px 52px 1fr 1fr 80px 56px'

function ResultRow({ d }: { d: F1DriverResult }) {
  const tc = teamColor(d.team)
  const isRetired = d.status === 'Retired' || d.status === 'Did not start'
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: TABLE_COLS,
      gap: 0,
      alignItems: 'center',
      padding: '10px 16px',
      borderBottom: '1px solid #F0EBE3',
      opacity: isRetired ? 0.5 : 1,
    }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, color: DARK }}>P{d.pos}</span>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#857A6A' }}>{d.grid}</span>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700 }}>
        {d.code}
        {d.fastestLap && <span style={{ marginLeft: 5, fontSize: 10, color: '#b45cff' }}>⚡</span>}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: tc, flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#4A4338', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.team}</span>
      </div>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#4A4338' }}>
        {d.time ? `+${d.time}` : d.status}
      </span>
      <PosChangeBadge change={d.posChange} />
    </div>
  )
}

function RaceDetail({ race }: { race: F1RaceResult }) {
  const podium = race.results.slice(0, 3)
  const rest = race.results.slice(3)
  const flDriver = race.results.find((r) => r.fastestLap)

  return (
    <div>
      {/* 상세 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: RED, marginBottom: 10 }}>
            Round {race.round}
          </div>
          <h3 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(24px, 3vw, 40px)', lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
            {race.raceName}
          </h3>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: '#857A6A', marginTop: 10 }}>
            {race.locality}, {race.country} · {formatDate(race.date)}
          </div>
        </div>
        {flDriver && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: '1px solid #E0D9CB', borderRadius: 4, padding: '10px 16px', flexShrink: 0 }}>
            <span style={{ fontSize: 16 }}>⚡</span>
            <div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', letterSpacing: '0.1em', marginBottom: 3 }}>FASTEST LAP</div>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700 }}>
                {flDriver.code}
                <span style={{ fontWeight: 400, color: '#857A6A', marginLeft: 6 }}>{flDriver.team}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 포디움 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 2 }}>
        {podium.map((d, i) => (
          <PodiumCard key={d.code} d={d} index={i} />
        ))}
      </div>

      {/* P4+ 결과 테이블 */}
      <div style={{ background: '#fff', border: '1px solid #E0D9CB' }}>
        <div style={{ display: 'grid', gridTemplateColumns: TABLE_COLS, gap: 0, padding: '8px 16px', borderBottom: '1px solid #E0D9CB', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
          {['POS', 'GRD', '드라이버', '팀', '기록', '변동'].map((h) => (
            <span key={h} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', letterSpacing: '0.08em' }}>{h}</span>
          ))}
        </div>
        <div style={{ maxHeight: 380, overflowY: 'auto' }}>
          {rest.map((d) => (
            <ResultRow key={d.code} d={d} />
          ))}
        </div>
      </div>
    </div>
  )
}

interface Props {
  results: F1RaceResult[]
}

export default function RaceResultCard({ results }: Props) {
  const [selectedRound, setSelectedRound] = useState<number | null>(
    results.length > 0 ? results[0].round : null,
  )

  if (results.length === 0) return null

  const selected = results.find((r) => r.round === selectedRound) ?? results[0]

  return (
    <section style={{ background: BG, borderBottom: '1px solid #E0D9CB', padding: '64px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>

        {/* 섹션 헤더 */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: RED, marginBottom: 10 }}>
            {new Date(results[0].date).getFullYear()} Season · Race Results
          </div>
          <h2 style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 0.95, letterSpacing: '-0.03em', textTransform: 'uppercase' }}>
            레이스 결과
          </h2>
        </div>

        {/* 목록 + 상세 레이아웃 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 320px) 1fr',
            gap: 24,
            alignItems: 'start',
          }}
          className="f1-results-grid"
        >
          {/* 좌측: 시즌 레이스 목록 */}
          <div style={{
            background: '#fff',
            border: '1px solid #E0D9CB',
            maxHeight: 720,
            overflowY: 'auto',
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.14em',
              color: '#857A6A',
              padding: '12px 16px',
              borderBottom: '1px solid #E0D9CB',
              position: 'sticky',
              top: 0,
              background: '#fff',
              zIndex: 1,
            }}>
              {results.length}개 레이스 완료
            </div>
            {results.map((race) => (
              <RaceListItem
                key={race.round}
                race={race}
                selected={race.round === selected.round}
                onSelect={() => setSelectedRound(race.round)}
              />
            ))}
          </div>

          {/* 우측: 선택된 레이스 상세 */}
          <RaceDetail race={selected} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .f1-results-grid {
            grid-template-columns: 1fr !important;
          }
          .f1-results-grid > div:first-child {
            max-height: 320px !important;
          }
        }
      `}</style>
    </section>
  )
}
