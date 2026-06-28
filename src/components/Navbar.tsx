'use client'

import { useState } from 'react'
import Logo from './Logo'
import { SERIES } from '@/lib/data'
import type { SportId } from '@/types'

interface NavbarProps {
  selectedSport: SportId
  onSelectSport: (id: SportId) => void
}

export default function Navbar({ selectedSport, onSelectSport }: NavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-border"
      style={{ background: 'rgba(242,239,232,0.85)', backdropFilter: 'blur(12px)' }}
    >
      {/* 1행: 로고 + 앵커 링크 */}
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-3.5">
          <Logo variant="light" size={40} />
          <div>
            <div className="font-archivo font-black text-2xl leading-none tracking-tight text-text">
              OneLap
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-text-muted mt-0.5">
              모터스포츠
            </div>
          </div>
        </div>

        {/* 데스크탑 앵커 링크 */}
        <nav className="hidden md:flex items-center gap-7 font-noto text-sm font-bold">
          <a href="#schedule" className="text-text hover:text-text-muted transition-colors">
            경기 일정 | 테스트!!!
          </a>
          <a href="#series" className="text-text hover:text-text-muted transition-colors">
            시작하기
          </a>
          <a href="#news" className="text-text hover:text-text-muted transition-colors">
            뉴스
          </a>
          <a
            href="#schedule"
            className="font-mono text-xs font-bold uppercase tracking-[0.08em] bg-text text-text-inv px-[18px] py-[9px] rounded-sm hover:opacity-80 transition-opacity"
          >
            LIVE
          </a>
        </nav>

        {/* 모바일 햄버거 버튼 */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          className="md:hidden flex flex-col justify-center gap-[5px] p-2 -mr-2 cursor-pointer"
        >
          <span
            className={`block w-[22px] h-[2px] bg-text transition-all duration-200 origin-center ${
              open ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-text transition-all duration-200 ${
              open ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`block w-[22px] h-[2px] bg-text transition-all duration-200 origin-center ${
              open ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </div>

      {/* 2행: 종목 탭 (데스크탑 + 모바일 공통 — 모바일은 가로 스크롤) */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {SERIES.filter((s) => ['f1', 'wec'].includes(s.id)).map((s) => {
              const active = s.id === selectedSport
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSport(s.id)}
                  className="flex flex-col items-center gap-[2px] px-4 py-2.5 cursor-pointer whitespace-nowrap flex-none transition-colors duration-150"
                  style={{
                    borderBottom: `3px solid ${active ? s.color : 'transparent'}`,
                    color: active ? '#15120D' : '#857A6A',
                  }}
                >
                  <span className="font-mono text-[12px] font-bold uppercase tracking-[0.06em]">
                    {s.short}
                  </span>
                  <span className="font-noto text-[10px] tracking-[-0.01em]">
                    {s.kr}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 모바일 드롭다운 메뉴 */}
      {open && (
        <nav
          className="md:hidden border-t border-border px-6 py-4 flex flex-col gap-1 font-noto text-sm font-bold"
          style={{ background: 'rgba(242,239,232,0.97)' }}
        >
          <a
            href="#schedule"
            onClick={() => setOpen(false)}
            className="text-text py-3 border-b border-border hover:text-text-muted transition-colors"
          >
            경기 일정
          </a>
          <a
            href="#series"
            onClick={() => setOpen(false)}
            className="text-text py-3 border-b border-border hover:text-text-muted transition-colors"
          >
            시작하기
          </a>
          <a
            href="#news"
            onClick={() => setOpen(false)}
            className="text-text py-3 border-b border-border hover:text-text-muted transition-colors"
          >
            뉴스
          </a>
          <a
            href="#schedule"
            onClick={() => setOpen(false)}
            className="font-mono text-xs font-bold uppercase tracking-[0.08em] bg-text text-text-inv px-[18px] py-[9px] rounded-sm hover:opacity-80 transition-opacity text-center mt-3"
          >
            LIVE
          </a>
        </nav>
      )}
    </header>
  )
}
