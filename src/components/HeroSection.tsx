'use client'

import { useState } from 'react'
import type { RaceDisplay } from '@/types'
import CountdownTimer from './CountdownTimer'

interface HeroSectionProps {
  races: RaceDisplay[]
}

function NavArrow({
  dir,
  onClick,
  disabled,
}: {
  dir: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center w-10 h-10 border transition-colors duration-150 disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
      style={{ borderColor: '#3A352C' }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = '#857A6A'
      }}
      onMouseLeave={(e) => {
        if (!disabled) (e.currentTarget as HTMLElement).style.borderColor = '#3A352C'
      }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        {dir === 'prev' ? (
          <path d="M9 2L4 7L9 12" stroke="#C9C1B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M5 2L10 7L5 12" stroke="#C9C1B2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  )
}

export default function HeroSection({ races }: HeroSectionProps) {
  const [idx, setIdx] = useState(0)
  const race = races[idx]
  const total = races.length

  if (!race) return null

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-14 pb-16">
      <div className="flex flex-wrap gap-12 items-center">
        {/* Left panel */}
        <div className="flex-1 min-w-[300px]" style={{ flexBasis: '480px' }}>
          {/* Sport badge */}
          <div className="flex items-center gap-3 mb-6">
            <span
              className="w-[9px] h-[9px] rounded-full flex-none"
              style={{
                background: race.color,
                boxShadow: `0 0 0 4px ${race.color}20`,
              }}
            />
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
              {idx === 0 ? '다음 경기' : '예정 경기'}
            </span>
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

          {/* Countdown */}
          <div className="mt-9">
            <CountdownTimer targetTs={race.ts} />
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 mt-8">
            <NavArrow dir="prev" onClick={() => setIdx((i) => i - 1)} disabled={idx === 0} />
            <NavArrow dir="next" onClick={() => setIdx((i) => i + 1)} disabled={idx === total - 1} />
            <span className="font-mono text-[11px] text-text-dim tracking-[0.08em] ml-1">
              {idx + 1} <span className="text-[#3A352C]">/</span> {total}
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col min-w-[280px]" style={{ flex: '1 1 380px' }}>
          {/* Image placeholder */}
          <div
            className="relative flex-1 min-h-[360px] border border-[#DAD2C2] flex items-end overflow-hidden"
            style={{
              background:
                'repeating-linear-gradient(48deg,#E4DFD3 0,#E4DFD3 11px,#ECE7DC 11px,#ECE7DC 22px)',
            }}
          >
            {/* Sport badge overlay */}
            <div
              className="absolute top-[18px] left-[18px] font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-white px-3 py-1.5 transition-colors duration-300"
              style={{ background: race.color }}
            >
              {race.sportName}
            </div>

            {/* Center placeholder text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-[11px] text-text-dim tracking-[0.1em] text-center">
              [ 경기장 사진 ]<br />대표 이미지
            </div>

            {/* Bottom overlay */}
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
