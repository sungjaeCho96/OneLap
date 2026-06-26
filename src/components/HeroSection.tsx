'use client'

import { useState } from 'react'
import type { RaceDisplay, RaceSession } from '@/types'
import CountdownTimer from './CountdownTimer'

interface HeroSectionProps {
  races: RaceDisplay[]
}

function sessionStatus(session: RaceSession): 'live' | 'past' | 'upcoming' {
  const now = Date.now()
  const ts = new Date(session.dateStart).getTime()
  const endTs = session.dateEnd
    ? new Date(session.dateEnd).getTime()
    : ts + 2 * 3_600_000
  if (ts <= now && endTs > now) return 'live'
  if (endTs <= now) return 'past'
  return 'upcoming'
}

function formatKST(dateStart: string): { date: string; time: string } {
  if (dateStart.length === 10) {
    const [, m, d] = dateStart.split('-')
    return { date: `${m}.${d}`, time: 'TBC' }
  }
  const d = new Date(dateStart)
  const kst = new Date(d.getTime() + 9 * 3_600_000)
  const wdays = ['일', '월', '화', '수', '목', '금', '토']
  return {
    date: `${String(kst.getUTCMonth() + 1).padStart(2, '0')}.${String(kst.getUTCDate()).padStart(2, '0')}(${wdays[kst.getUTCDay()]})`,
    time: `${String(kst.getUTCHours()).padStart(2, '0')}:${String(kst.getUTCMinutes()).padStart(2, '0')}`,
  }
}

export default function HeroSection({ races }: HeroSectionProps) {
  const [idx, setIdx] = useState(0)

  if (races.length === 0) return null

  const now = Date.now()
  const total = races.length
  const race = races[idx]
  const liveCount = races.filter((r) => r.isLive).length
  const pad = (n: number) => String(n).padStart(2, '0')

  const sessions = race.sessions ?? []
  const nextIdx = sessions.findIndex((s) => {
    const ts = new Date(s.dateStart).getTime()
    const endTs = s.dateEnd ? new Date(s.dateEnd).getTime() : ts + 2 * 3_600_000
    return endTs > now
  })
  const nextSession = nextIdx >= 0 ? sessions[nextIdx] : null
  const liveSession = nextSession && sessionStatus(nextSession) === 'live' ? nextSession : null

  const countdownTs = nextSession ? new Date(nextSession.dateStart).getTime() : race.ts
  const countdownIsLive = !!liveSession

  let statusLabel: string
  if (liveSession) {
    statusLabel = `${liveSession.name} 진행 중`
  } else if (nextSession && nextSession.name !== '결승') {
    statusLabel = `다음: ${nextSession.name}`
  } else {
    statusLabel = idx === liveCount ? '다음 경기' : '예정 경기'
  }

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-14 pb-16">
      <div className="flex flex-wrap gap-12 items-center">
        {/* Left panel */}
        <div className="flex-1 min-w-[300px]" style={{ flexBasis: '480px' }}>

          {/* Status badge row */}
          <div className="flex items-center gap-[10px] mb-6 flex-wrap">
            {(race.isLive || liveSession) ? (
              <>
                <span
                  className="inline-flex items-center gap-[7px] text-white font-mono text-xs font-bold uppercase tracking-[0.12em] px-[11px] py-[5px] rounded-sm"
                  style={{ background: '#E10600', animation: 'livepulse 1.6s infinite' }}
                >
                  <span
                    className="w-[7px] h-[7px] rounded-full bg-white flex-none"
                    style={{ animation: 'liveblink 1.2s infinite' }}
                  />
                  LIVE
                </span>
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
                  {liveSession ? liveSession.name : '지금 진행 중'}
                </span>
              </>
            ) : (
              <>
                <span
                  className="w-[9px] h-[9px] rounded-full flex-none"
                  style={{
                    background: race.color,
                    boxShadow: `0 0 0 4px ${race.color}20`,
                  }}
                />
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
                  {statusLabel}
                </span>
              </>
            )}
            <span
              className="font-mono text-xs font-bold uppercase tracking-[0.18em]"
              style={{ color: race.color }}
            >
              {race.sportShort}
            </span>
          </div>

          {/* Race name */}
          <h1
            className="font-archivo font-black uppercase leading-[0.93] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(42px, 6.4vw, 82px)' }}
          >
            {race.name}
          </h1>

          {/* Color underline */}
          <div
            className="h-[5px] w-[120px] mb-[22px] transition-colors duration-300"
            style={{ background: race.color }}
          />

          {/* Korean name + description */}
          <p className="text-[17px] leading-[1.6] text-text-mid max-w-[480px] mb-2">
            {race.sportKr} · {race.extra || '경기'}
          </p>

          {/* Location / round */}
          <div className="flex flex-wrap gap-x-[26px] gap-y-1 font-mono text-[13px] mt-3.5">
            <span>📍 {race.circuit}</span>
            <span className="text-text-muted">{race.loc}</span>
            <span className="text-text-muted">{race.roundLabel}</span>
          </div>

          {/* Countdown / Elapsed */}
          <div className="mt-9">
            <CountdownTimer targetTs={countdownTs} isLive={countdownIsLive} />
          </div>

          {/* Navigation */}
          {total > 1 && (
            <div className="flex items-center gap-[18px] mt-[26px] flex-wrap">
              <div className="flex gap-2">
                <button
                  onClick={() => setIdx((i) => Math.max(0, i - 1))}
                  disabled={idx === 0}
                  aria-label="이전 경기"
                  className="w-[42px] h-[42px] flex items-center justify-center border text-[20px] leading-none rounded-sm transition-all duration-150 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  style={{ borderColor: '#15120D', background: 'transparent', color: '#15120D' }}
                >
                  ‹
                </button>
                <button
                  onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
                  disabled={idx === total - 1}
                  aria-label="다음 경기"
                  className="w-[42px] h-[42px] flex items-center justify-center border text-[20px] leading-none rounded-sm transition-all duration-150 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  style={{ background: '#15120D', borderColor: '#15120D', color: '#F2EFE8' }}
                >
                  ›
                </button>
              </div>

              <div className="flex gap-[7px] items-center">
                {races.map((r, i) => {
                  const isActive = i === idx
                  const dotColor = isActive
                    ? (r.isLive ? '#E10600' : '#15120D')
                    : '#CFC7B6'
                  const dotW = isActive ? '22px' : '8px'
                  return (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      aria-label="경기 선택"
                      className="h-2 rounded-full border-none p-0 cursor-pointer transition-all duration-200"
                      style={{ width: dotW, background: dotColor }}
                    />
                  )
                })}
              </div>

              <span className="ml-auto font-mono text-xs tracking-[0.1em] text-text-muted">
                {pad(idx + 1)} / {pad(total)}
              </span>
            </div>
          )}
        </div>

        {/* Right panel */}
        <div className="flex flex-col min-w-[280px]" style={{ flex: '1 1 380px' }}>
          {sessions.length > 0 ? (
            <div className="flex-1 border border-[#DAD2C2] overflow-hidden bg-white">
              <div className="px-5 py-[14px] border-b border-[#DAD2C2]">
                <div className="font-mono text-[10px] text-text-muted tracking-[0.12em] uppercase mb-0.5">
                  세션 일정 · KST
                </div>
                <div className="font-archivo font-bold text-[14px] uppercase leading-tight">
                  {race.circuit}
                </div>
              </div>
              <div className="divide-y divide-[#EDE8DF]">
                {sessions.map((session, i) => {
                  const status = sessionStatus(session)
                  const isNext = i === nextIdx
                  const { date, time } = formatKST(session.dateStart)
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-5 py-[11px] ${status === 'past' ? 'opacity-35' : ''}`}
                      style={isNext && status !== 'live' ? { background: `${race.color}0D` } : undefined}
                    >
                      <div className="w-[8px] flex-none flex items-center justify-center">
                        {status === 'live' ? (
                          <span
                            className="w-[8px] h-[8px] rounded-full block bg-[#E10600]"
                            style={{ animation: 'liveblink 1.2s infinite' }}
                          />
                        ) : isNext ? (
                          <span
                            className="w-[8px] h-[8px] rounded-full block"
                            style={{ background: race.color }}
                          />
                        ) : (
                          <span className="w-[6px] h-[6px] rounded-full block bg-[#CFC7B6]" />
                        )}
                      </div>
                      <span
                        className={`font-mono text-[12px] font-bold flex-1 ${status === 'live' ? 'text-[#E10600]' : ''}`}
                      >
                        {session.name}
                        {status === 'live' && (
                          <span className="ml-2 text-[9px] bg-[#E10600] text-white px-[5px] py-[2px] rounded-sm font-black tracking-[0.08em]">
                            LIVE
                          </span>
                        )}
                      </span>
                      <div className="text-right flex-none">
                        <div className="font-mono text-[10px] text-text-muted">{date}</div>
                        <div className={`font-mono text-[12px] font-bold ${status === 'live' ? 'text-[#E10600]' : ''}`}>
                          {time}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div
              className="relative flex-1 min-h-[360px] border border-[#DAD2C2] flex items-end overflow-hidden"
              style={{
                background:
                  'repeating-linear-gradient(48deg,#E4DFD3 0,#E4DFD3 11px,#ECE7DC 11px,#ECE7DC 22px)',
              }}
            >
              <div
                className="absolute top-[18px] left-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white px-3 py-1.5 transition-colors duration-300"
                style={{ background: race.color }}
              >
                {race.sportName}
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-text-dim tracking-[0.1em] text-center">
                [ 경기장 사진 ]<br />대표 이미지
              </div>
              <div
                className="relative w-full px-5 py-5 text-white"
                style={{ background: 'linear-gradient(transparent,rgba(21,18,13,0.82))' }}
              >
                <div className="font-archivo font-extrabold text-[18px] uppercase leading-[1.15]">
                  {race.circuit}
                </div>
                <div className="font-mono text-[11px] text-[#D8D2C6] mt-1">
                  {race.dateLong}
                </div>
              </div>
            </div>
          )}

          {/* Tip card */}
          <div className="bg-white border border-[#DAD2C2] border-t-0 px-5 py-[18px]">
            <div className="font-mono text-[11px] text-text-muted tracking-[0.08em] mb-2">
              💡 TIP
            </div>
            <p className="text-[13px] leading-[1.5] text-text-mid">{race.tip}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
