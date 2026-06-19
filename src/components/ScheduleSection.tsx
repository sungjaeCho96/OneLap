'use client'

import { useState } from 'react'
import type { RaceDisplay, RaceSession } from '@/types'
import { SERIES } from '@/lib/data'

interface ScheduleSectionProps {
  schedule: RaceDisplay[]
}

const FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'f1', label: 'F1' },
  { id: 'wec', label: 'WEC' },
  { id: 'wrc', label: 'WRC' },
  { id: 'superrace', label: '슈퍼레이스' },
  { id: 'nfestival', label: '현대 N' },
]

const SPORT_COLORS: Record<string, string> = Object.fromEntries(
  SERIES.map((s) => [s.id, s.color])
)

function filterAccent(id: string) {
  return id === 'all' ? '#E10600' : SPORT_COLORS[id]
}

// ISO → KST 표시: "6/28(일)" / "22:00 KST" 또는 "시간 미정"
function formatSessionDate(iso: string, tbc = false): { date: string; time: string } {
  const weekdays = ['일', '월', '화', '수', '목', '금', '토']

  if (tbc) {
    // YYYY-MM-DD 형식
    const [, m, d] = iso.split('-').map(Number)
    const wday = weekdays[new Date(iso).getDay()]
    return { date: `${m}/${d}(${wday})`, time: '시간 미정' }
  }

  const kst = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000)
  const month = kst.getUTCMonth() + 1
  const day = kst.getUTCDate()
  const wday = weekdays[kst.getUTCDay()]
  const hh = String(kst.getUTCHours()).padStart(2, '0')
  const mm = String(kst.getUTCMinutes()).padStart(2, '0')
  return { date: `${month}/${day}(${wday})`, time: `${hh}:${mm}` }
}

function SessionPanel({ sessions, color }: { sessions: RaceSession[]; color: string }) {
  return (
    <div
      className="border-b border-border-dark overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)' }}
    >
      <div className="flex flex-wrap gap-2 px-8 py-4">
        {sessions.map((s) => {
          const { date, time } = formatSessionDate(s.dateStart, s.tbc)
          const isRace = s.name === '결승'
          const isTbc = s.tbc
          return (
            <div
              key={s.name}
              className="flex items-center gap-2.5 px-3 py-2 border"
              style={{
                borderColor: isRace ? color : '#3A352C',
                background: isRace ? `${color}18` : 'transparent',
              }}
            >
              <span
                className="font-mono text-[10px] font-bold tracking-[0.06em] min-w-[72px]"
                style={{ color: isRace ? color : '#C9C1B2' }}
              >
                {s.name}
              </span>
              <span className="font-mono text-[11px] text-[#9A9081]">{date}</span>
              <span
                className="font-mono text-[11px] font-bold"
                style={{ color: isTbc ? '#6E655A' : isRace ? color : '#D8D2C6' }}
              >
                {isTbc ? '시간 미정' : `${time} KST`}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RaceRow({
  r,
  isExpanded,
  onToggle,
}: {
  r: RaceDisplay
  isExpanded: boolean
  onToggle: () => void
}) {
  const hasSessions = (r.sessions?.length ?? 0) > 0

  return (
    <>
      <div
        onClick={hasSessions ? onToggle : undefined}
        className={[
          'flex flex-wrap items-center gap-5 py-[22px] px-2 border-b border-border-dark text-text-inv relative',
          'transition-colors',
          hasSessions ? 'cursor-pointer hover:bg-white/[0.03]' : '',
          isExpanded ? 'bg-white/[0.04]' : '',
        ].join(' ')}
      >
        {/* Sport color bar */}
        <div
          className="w-[5px] self-stretch min-h-[48px] flex-none"
          style={{ background: r.color }}
        />

        {/* Date */}
        <div className="flex-none w-[84px] text-center">
          <div className="font-archivo font-black text-[34px] leading-[0.9]">{r.day}</div>
          <div className="font-mono text-[11px] text-text-dim tracking-[0.1em] mt-1">
            {r.month} · {r.wday}
          </div>
        </div>

        {/* Sport + race name */}
        <div className="flex-1 min-w-[200px]" style={{ flexBasis: '260px' }}>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span
              className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-bg-dark px-2 py-[3px]"
              style={{ background: r.color }}
            >
              {r.sportShort}
            </span>
            <span className="font-mono text-[11px] text-text-muted tracking-[0.08em]">
              {r.roundLabel}
            </span>
          </div>
          <div className="font-archivo font-extrabold text-[21px] uppercase leading-[1.1]">
            {r.name}
          </div>
        </div>

        {/* Circuit */}
        <div className="flex-1 min-w-[140px]" style={{ flexBasis: '180px' }}>
          <div className="font-bold text-[15px]">{r.circuit}</div>
          <div className="font-mono text-xs text-text-dim mt-[3px]">{r.loc}</div>
        </div>

        {/* Extra info + chevron */}
        <div className="flex-none text-right min-w-[96px] flex items-center justify-end gap-3">
          <div>
            <div className="font-mono text-xs text-[#D8D2C6]">{r.laps}</div>
            <div className="font-mono text-[11px] text-text-muted mt-1">{r.extra}</div>
          </div>
          {hasSessions && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="flex-none transition-transform duration-200"
              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <path
                d="M4 6L8 10L12 6"
                stroke="#857A6A"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>

      {/* Session panel – CSS max-height transition */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isExpanded ? '300px' : '0px' }}
      >
        {hasSessions && <SessionPanel sessions={r.sessions!} color={r.color} />}
      </div>
    </>
  )
}

export default function ScheduleSection({ schedule }: ScheduleSectionProps) {
  const [filter, setFilter] = useState('all')
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  const filtered = filter === 'all' ? schedule : schedule.filter((r) => r.sport === filter)

  function rowKey(r: RaceDisplay) {
    return `${r.sport}-${r.round}`
  }

  function toggleRow(r: RaceDisplay) {
    const key = rowKey(r)
    setExpandedKey((prev) => (prev === key ? null : key))
  }

  return (
    <section id="schedule" className="bg-bg-dark text-text-inv py-16">
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-accent mb-3">
              Calendar
            </div>
            <h2
              className="font-archivo font-black uppercase leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
            >
              다음 경기들
            </h2>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = f.id === filter
              const color = filterAccent(f.id)
              const isWrc = f.id === 'wrc'
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilter(f.id)
                    setExpandedKey(null)
                  }}
                  className="font-mono text-xs font-bold uppercase tracking-[0.06em] px-4 py-[9px] border cursor-pointer transition-all duration-150"
                  style={{
                    background: active ? color : 'transparent',
                    color: active ? (isWrc ? '#15120D' : '#fff') : '#C9C1B2',
                    borderColor: active ? color : '#3A352C',
                  }}
                >
                  {f.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Race list */}
        <div className="border-t border-border-dark">
          {filtered.map((r) => (
            <RaceRow
              key={rowKey(r)}
              r={r}
              isExpanded={expandedKey === rowKey(r)}
              onToggle={() => toggleRow(r)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
