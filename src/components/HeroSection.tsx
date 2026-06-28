'use client'

import { useState, useEffect } from 'react'
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

const FLAG_TABLE: ReadonlyArray<readonly [readonly string[], string]> = [
  [['바레인', 'Bahrain', 'Sakhir'], '🇧🇭'],
  [['사우디', 'Saudi', 'Jeddah'], '🇸🇦'],
  [['호주', 'Australia', 'Melbourne', 'Albert Park'], '🇦🇺'],
  [['일본', 'Japan', 'Suzuka'], '🇯🇵'],
  [['중국', 'China', 'Shanghai'], '🇨🇳'],
  [['마이애미', 'Miami'], '🇺🇸'],
  [['라스베이거스', 'Las Vegas', 'Vegas'], '🇺🇸'],
  [['오스틴', 'Austin', 'COTA', 'Americas'], '🇺🇸'],
  [['이탈리아', 'Italy', 'Monza', 'Imola', 'Emilia'], '🇮🇹'],
  [['모나코', 'Monaco', 'Monte Carlo'], '🇲🇨'],
  [['캐나다', 'Canada', 'Montreal', 'Villeneuve'], '🇨🇦'],
  [['스페인', 'Spain', 'Barcelona', 'Catalunya', 'Madrid'], '🇪🇸'],
  [['오스트리아', 'Austria', 'Spielberg', 'Red Bull Ring'], '🇦🇹'],
  [['영국', 'British', 'Britain', 'Silverstone'], '🇬🇧'],
  [['헝가리', 'Hungar', 'Budapest', 'Hungaroring'], '🇭🇺'],
  [['벨기에', 'Belgium', 'Spa'], '🇧🇪'],
  [['네덜란드', 'Dutch', 'Netherlands', 'Zandvoort'], '🇳🇱'],
  [['싱가포르', 'Singapore', 'Marina Bay'], '🇸🇬'],
  [['멕시코', 'Mexico'], '🇲🇽'],
  [['브라질', 'Brazil', 'Interlagos', 'Sao Paulo', 'São Paulo'], '🇧🇷'],
  [['아부다비', 'Abu Dhabi', 'Yas Marina', 'UAE'], '🇦🇪'],
  [['카타르', 'Qatar', 'Losail', 'Lusail'], '🇶🇦'],
  [['아제르바이잔', 'Azerbaijan', 'Baku'], '🇦🇿'],
]

function flagFor(loc: string, circuit: string): string {
  const haystack = `${loc} ${circuit}`
  for (const [keys, flag] of FLAG_TABLE) {
    if (keys.some((k) => haystack.includes(k))) return flag
  }
  return '🏁'
}

export default function HeroSection({ races }: HeroSectionProps) {
  const [idx, setIdx] = useState(0)
  const [isFlipped, setIsFlipped] = useState(true)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    setAnimate(false)
    setIsFlipped(true)
    const timer = setTimeout(() => {
      setAnimate(true)
      setIsFlipped(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [idx])

  if (races.length === 0) return null

  const now = Date.now()
  const total = races.length
  const race = races[idx]
  const liveCount = races.filter((r) => r.isLive).length
  const pad = (n: number) => String(n).padStart(2, '0')

  const goTo = (next: number) => {
    setIdx(next)
  }

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
    <section className="bg-bg-alt">
      <div className="mx-auto max-w-[1280px] px-6 py-14 pb-16">
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
                  onClick={() => goTo(Math.max(0, idx - 1))}
                  disabled={idx === 0}
                  aria-label="이전 경기"
                  className="w-[42px] h-[42px] flex items-center justify-center border text-[20px] leading-none rounded-sm transition-all duration-150 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
                  style={{ borderColor: '#15120D', background: 'transparent', color: '#15120D' }}
                >
                  ‹
                </button>
                <button
                  onClick={() => goTo(Math.min(total - 1, idx + 1))}
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
                      onClick={() => goTo(i)}
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
          {/* Flip card — front: 타임테이블 / back: 그랑프리 상징 */}
          <div className="relative flex-1" style={{ perspective: '1000px' }}>
            <div
              role="button"
              tabIndex={0}
              aria-label={isFlipped ? '타임테이블 보기' : '그랑프리 정보 보기'}
              onClick={() => { setAnimate(true); setIsFlipped((f) => !f) }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setAnimate(true)
                  setIsFlipped((f) => !f)
                }
              }}
              className={`relative w-full cursor-pointer ease-in-out${animate ? ' transition-transform duration-[600ms]' : ''}`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              {/* Front */}
              <div className="relative" style={{ backfaceVisibility: 'hidden' }}>
          {sessions.length > 0 ? (
            <div className="relative flex-1 overflow-hidden bg-[#15120D] min-h-[360px]">
              {/* top accent bar — series color */}
              <div className="h-[3px] w-full" style={{ background: race.color }} />

              {/* Header — pit wall monitor */}
              <div
                className="flex items-center justify-between px-5 py-[15px] border-b border-white/10"
                style={{ background: `linear-gradient(90deg, ${race.color}26, transparent 70%)` }}
              >
                <div>
                  <div className="font-mono text-[10px] text-white/40 tracking-[0.16em] uppercase mb-[3px]">
                    세션 일정 · KST
                  </div>
                  <div className="font-archivo font-bold text-[15px] uppercase leading-tight text-white tracking-[0.01em]">
                    {race.circuit}
                  </div>
                </div>
                <span
                  className="font-mono text-[10px] font-black uppercase tracking-[0.14em] px-[7px] py-[3px] rounded-sm flex-none"
                  style={{ background: race.color, color: '#15120D' }}
                >
                  {race.sportShort}
                </span>
              </div>

              {/* Session rows */}
              <div>
                {sessions.map((session, i) => {
                  const status = sessionStatus(session)
                  const isNext = i === nextIdx
                  const { date, time } = formatKST(session.dateStart)
                  const accent = status === 'live' ? '#E10600' : isNext ? race.color : undefined
                  const rowBg =
                    status === 'live'
                      ? 'rgba(225,6,0,0.12)'
                      : isNext
                        ? `${race.color}1F`
                        : undefined
                  return (
                    <div
                      key={i}
                      className={`relative flex items-center gap-3 pl-[18px] pr-5 py-[12px] border-b border-white/[0.06] transition-colors ${status === 'past' ? 'opacity-40' : ''}`}
                      style={rowBg ? { background: rowBg } : undefined}
                    >
                      {/* left accent bar */}
                      <span
                        className="absolute left-0 top-0 bottom-0 w-[3px]"
                        style={accent ? { background: accent } : undefined}
                      />

                      {/* status indicator */}
                      <div className="w-[9px] flex-none flex items-center justify-center">
                        {status === 'live' ? (
                          <span
                            className="w-[9px] h-[9px] rounded-full block bg-[#E10600]"
                            style={{
                              boxShadow: '0 0 8px 1px rgba(225,6,0,0.8)',
                              animation: 'liveblink 1.2s infinite',
                            }}
                          />
                        ) : isNext ? (
                          <span
                            className="w-[8px] h-[8px] rounded-full block"
                            style={{ background: race.color, boxShadow: `0 0 7px 0 ${race.color}` }}
                          />
                        ) : (
                          <span className="w-[5px] h-[5px] rounded-full block bg-white/25" />
                        )}
                      </div>

                      {/* session name */}
                      <span
                        className={`font-mono text-[12px] font-bold flex-1 flex items-center ${
                          status === 'live'
                            ? 'text-[#FF4D45]'
                            : isNext
                              ? 'text-white'
                              : 'text-white/55'
                        }`}
                      >
                        {session.name}
                        {status === 'live' && (
                          <span
                            className="ml-2 text-[9px] bg-[#E10600] text-white px-[5px] py-[2px] rounded-sm font-black tracking-[0.08em]"
                            style={{ animation: 'livepulse 1.6s infinite' }}
                          >
                            LIVE
                          </span>
                        )}
                        {isNext && status !== 'live' && (
                          <span
                            className="ml-2 text-[8px] font-black tracking-[0.1em] uppercase px-[5px] py-[2px] rounded-sm"
                            style={{ background: `${race.color}2E`, color: race.color }}
                          >
                            NEXT
                          </span>
                        )}
                      </span>

                      {/* time block */}
                      <div className="text-right flex-none tabular-nums">
                        <div className="font-mono text-[10px] text-white/35 leading-tight">
                          {date}
                        </div>
                        <div
                          className={`font-archivo font-bold text-[14px] leading-tight tracking-[0.02em] ${
                            status === 'live'
                              ? 'text-[#FF4D45]'
                              : isNext
                                ? 'text-white'
                                : 'text-white/65'
                          }`}
                        >
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

                {/* flip hint */}
                <div className="absolute bottom-3 right-3 flex items-center gap-[5px] font-mono text-[10px] uppercase tracking-[0.12em] text-white/35 pointer-events-none">
                  <span className="text-[13px] leading-none">↻</span>
                  정보 보기
                </div>
              </div>

              {/* Back — 그랑프리 상징 */}
              <div
                className="absolute inset-0 flex flex-col overflow-hidden bg-[#15120D]"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                {/* top accent bar — series color */}
                <div className="h-[3px] w-full flex-none" style={{ background: race.color }} />

                {/* series color glow accent */}
                <div
                  className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full opacity-25 blur-2xl"
                  style={{ background: race.color }}
                />

                <div className="relative flex-1 flex flex-col px-6 py-6">
                  {/* round + series badge */}
                  <div className="flex items-center justify-between">
                    <span
                      className="font-mono text-[11px] font-black uppercase tracking-[0.16em] px-[7px] py-[3px] rounded-sm"
                      style={{ background: race.color, color: '#ffffff' }}
                    >
                      {race.sportShort}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/45">
                      {race.roundLabel}
                    </span>
                  </div>

                  {/* flag + circuit */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
                    <div className="text-[64px] leading-none drop-shadow-lg">
                      {flagFor(race.loc, race.circuit)}
                    </div>
                    <div
                      className="font-archivo font-black uppercase leading-[0.95] tracking-[-0.01em] text-white"
                      style={{ fontSize: 'clamp(24px, 3.4vw, 34px)' }}
                    >
                      {race.circuit}
                    </div>
                    <div
                      className="font-mono text-[13px] uppercase tracking-[0.18em]"
                      style={{ color: race.color }}
                    >
                      {race.loc}
                    </div>
                  </div>

                  {/* date + hint */}
                  <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                    <span className="font-mono text-[12px] text-white/60 tabular-nums">
                      {race.dateLong}
                    </span>
                    <span className="flex items-center gap-[5px] font-mono text-[10px] uppercase tracking-[0.12em] text-white/35">
                      <span className="text-[13px] leading-none">↺</span>
                      탭하여 일정 보기
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tip card */}
          <div
            className="relative px-5 py-[18px] overflow-hidden"
            style={{
              background: '#1C1812',
              borderLeft: `3px solid ${race.color}`,
            }}
          >
            <div
              className="font-mono text-[11px] font-bold tracking-[0.12em] uppercase mb-2 flex items-center gap-1.5"
              style={{ color: race.color }}
            >
              💡 TIP
            </div>
            <p className="text-[13px] leading-[1.55] text-white/70">{race.tip}</p>
          </div>
        </div>
      </div>
      </div>
    </section>
  )
}
