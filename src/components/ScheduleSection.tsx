'use client'

import { useEffect, useState } from 'react'
import type { RaceDisplay } from '@/types'

interface ScheduleSectionProps {
  schedule: RaceDisplay[]
}

function fmtElapsed(startTs: number, now: number): string {
  const sec = Math.floor(Math.max(0, now - startTs) / 1000)
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h > 0 ? `${h}시간 ${m}분 경과` : `${m}분 경과`
}

function clientEndTs(r: RaceDisplay): number {
  if (r.sessions && r.sessions.length > 0) {
    const last = r.sessions[r.sessions.length - 1]
    const lastTs = new Date(last.dateStart).getTime()
    if (last.dateEnd) {
      const endTs = new Date(last.dateEnd).getTime()
      if (endTs > lastTs) return endTs
    }
    if (last.tbc || last.dateStart.length === 10) return lastTs + 24 * 3_600_000
    return lastTs + 4 * 3_600_000
  }
  return r.ts + 3 * 3_600_000
}

function clientIsLive(r: RaceDisplay, now: number): boolean {
  return r.ts <= now && clientEndTs(r) > now
}

function LiveCard({ r, now }: { r: RaceDisplay; now: number }) {
  return (
    <div
      className="flex flex-col gap-[14px] text-text-inv"
      style={{
        background: '#1E1A12',
        border: '1px solid rgba(52,48,38,0.38)',
        borderLeft: `5px solid ${r.color}`,
        padding: '22px 22px 20px',
      }}
    >
      <div className="flex items-center gap-[10px] flex-wrap">
        <span
          className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-bg-dark px-2 py-[3px]"
          style={{ background: r.color }}
        >
          {r.sportShort}
        </span>
        <span
          className="inline-flex items-center gap-[5px] font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-white px-2 py-[3px]"
          style={{ background: '#E10600', animation: 'livepulse 1.6s infinite' }}
        >
          <span
            className="w-[5px] h-[5px] rounded-full bg-white flex-none"
            style={{ animation: 'liveblink 1.2s infinite' }}
          />
          LIVE
        </span>
        <span className="font-mono text-[11px] text-text-muted tracking-[0.08em]">
          {r.roundLabel}
        </span>
      </div>

      <div className="font-archivo font-extrabold text-[24px] uppercase leading-[1.08]">
        {r.name}
      </div>

      <div className="flex justify-between items-end gap-3">
        <div>
          <div className="font-bold text-[15px]">{r.circuit}</div>
          <div className="font-mono text-xs text-text-dim mt-[3px]">{r.loc}</div>
        </div>
        <div className="text-right flex-none">
          <div className="font-mono font-bold text-[15px] text-text-inv">
            {fmtElapsed(r.ts, now)}
          </div>
          <div className="font-mono text-[11px] text-text-muted mt-[3px]">{r.laps}</div>
        </div>
      </div>
    </div>
  )
}

interface DateGroup {
  key: string
  day: string
  month: string
  wday: string
  races: RaceDisplay[]
}

function buildGroups(races: RaceDisplay[]): DateGroup[] {
  const map = new Map<string, DateGroup>()
  for (const r of races) {
    const key = r.dateLong
    if (!map.has(key)) {
      map.set(key, { key, day: r.day, month: r.month, wday: r.wday, races: [] })
    }
    map.get(key)!.races.push(r)
  }
  return Array.from(map.values())
}

function RaceItem({ r }: { r: RaceDisplay }) {
  return (
    <div
      className="flex flex-wrap items-center gap-4 py-3 pr-3 text-text-inv transition-colors duration-150"
      style={{ cursor: 'default' }}
    >
      <div
        className="w-1 self-stretch flex-none"
        style={{ background: r.color, minHeight: '42px' }}
      />
      <div className="flex-1 min-w-[180px]" style={{ flexBasis: '220px' }}>
        <div className="flex items-center gap-[10px] mb-1.5 flex-wrap">
          <span
            className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-bg-dark px-2 py-[3px]"
            style={{ background: r.color }}
          >
            {r.sportShort}
          </span>
          <span className="font-mono text-[11px] text-text-muted tracking-[0.08em]">
            {r.roundLabel}
          </span>
          <span className="font-mono text-[11px] text-[#9A9081] tracking-[0.06em]">
            {r.timeLabel} KST
          </span>
        </div>
        <div className="font-archivo font-extrabold text-[20px] uppercase leading-[1.1]">
          {r.name}
        </div>
      </div>
      <div className="flex-1 min-w-[130px]" style={{ flexBasis: '160px' }}>
        <div className="font-bold text-[15px]">{r.circuit}</div>
        <div className="font-mono text-xs text-text-dim mt-[3px]">{r.loc}</div>
      </div>
      <div className="flex-none text-right min-w-[90px]">
        <div className="font-mono text-xs text-[#D8D2C6]">{r.laps}</div>
        <div className="font-mono text-[11px] text-text-muted mt-1">{r.extra}</div>
      </div>
    </div>
  )
}

export default function ScheduleSection({ schedule }: ScheduleSectionProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const liveRaces = schedule.filter((r) => clientIsLive(r, now))
  const upcoming = schedule.filter((r) => !clientIsLive(r, now) && r.ts > now)
  const groups = buildGroups(upcoming)

  return (
    <section id="schedule" className="bg-bg-dark text-text-inv py-16">
      <div className="mx-auto max-w-[1280px] px-6">

        {/* Header */}
        <div className="mb-9">
          <div className="font-mono text-xs uppercase tracking-[0.18em] text-accent mb-3">
            Calendar
          </div>
          <h2
            className="font-archivo font-black uppercase leading-[0.95] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
          >
            경기 일정
          </h2>
        </div>

        {/* LIVE NOW */}
        {liveRaces.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="inline-flex items-center gap-[7px] text-white font-mono text-[13px] font-bold uppercase tracking-[0.12em] px-3 py-[6px] rounded-sm"
                style={{ background: '#E10600', animation: 'livepulse 1.6s infinite' }}
              >
                <span
                  className="w-[7px] h-[7px] rounded-full bg-white flex-none"
                  style={{ animation: 'liveblink 1.2s infinite' }}
                />
                LIVE
              </span>
              <h3
                className="font-archivo font-black uppercase tracking-[-0.02em]"
                style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}
              >
                진행 중인 경기
              </h3>
              <span className="font-mono text-[13px] text-[#9A9081]">
                {liveRaces.length}경기
              </span>
            </div>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {liveRaces.map((r) => (
                <LiveCard key={`${r.sport}-${r.round}`} r={r} now={now} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming — grouped by date */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3
              className="font-archivo font-black uppercase tracking-[-0.02em]"
              style={{ fontSize: 'clamp(22px, 3vw, 30px)' }}
            >
              다음 경기
            </h3>
            <span className="font-mono text-[13px] text-[#9A9081]">
              {upcoming.length}경기 예정
            </span>
          </div>

          {groups.length > 0 ? (
            <div style={{ borderTop: '1px solid #2C271F' }}>
              {groups.map((g) => (
                <div
                  key={g.key}
                  className="flex flex-wrap gap-6"
                  style={{ borderBottom: '1px solid #2C271F', padding: '24px 8px' }}
                >
                  {/* Date column */}
                  <div className="flex-none" style={{ width: '108px' }}>
                    <div className="font-archivo font-black text-[40px] leading-[0.85]">
                      {g.day}
                    </div>
                    <div className="font-mono text-[11px] text-[#9A9081] tracking-[0.1em] mt-[6px]">
                      {g.month} · {g.wday}
                    </div>
                    {g.races.length > 1 && (
                      <div
                        className="inline-block mt-[10px] font-mono text-[10px] font-bold uppercase tracking-[0.06em] px-[7px] py-[3px]"
                        style={{ color: '#E10600', border: '1px solid #E10600' }}
                      >
                        {g.races.length}경기
                      </div>
                    )}
                  </div>

                  {/* Race list */}
                  <div className="flex-1 min-w-[240px] flex flex-col gap-0.5" style={{ flexBasis: '320px' }}>
                    {g.races.map((r) => (
                      <RaceItem key={`${r.sport}-${r.round}`} r={r} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="font-mono text-[13px] text-text-muted py-10 px-2"
              style={{ borderTop: '1px solid #2C271F' }}
            >
              예정된 경기가 없습니다.
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
