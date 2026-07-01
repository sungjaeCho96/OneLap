'use client'

import { useId, useState, type KeyboardEvent } from 'react'
import GuideIntro from './GuideIntro'
import GuideGrid from './GuideGrid'
import GuideRules from './GuideRules'
import GuideFlags from './GuideFlags'
import GuideWatching from './GuideWatching'
import type { AnalysisTabItem } from '../analysis/types'

// AnalysisSection과 달리 챕터 전환 시 상태 보존이 필요 없어
// 활성 챕터만 조건부 렌더링한다 (DriverGallery 등 무거운 컴포넌트의 초기 마운트 비용 절감).
const CHAPTERS: AnalysisTabItem[] = [
  { id: 'ch1', label: 'F1이란?', eyebrow: 'CHAPTER 01', content: <GuideIntro /> },
  { id: 'ch2', label: '그리드 — 팀 · 드라이버', eyebrow: 'CHAPTER 02', content: <GuideGrid /> },
  { id: 'ch3', label: '레이스 규칙', eyebrow: 'CHAPTER 03', content: <GuideRules /> },
  {
    id: 'ch4',
    label: '관전 포인트',
    eyebrow: 'CHAPTER 04',
    content: (
      <>
        <GuideFlags />
        <GuideWatching />
      </>
    ),
  },
]

export default function GuideSection() {
  const baseId = useId()
  const [activeId, setActiveId] = useState(CHAPTERS[0].id)
  const activeChapter = CHAPTERS.find((c) => c.id === activeId) ?? CHAPTERS[0]

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, tabId: string) {
    const idx = CHAPTERS.findIndex((c) => c.id === tabId)
    if (e.key === 'ArrowRight') {
      setActiveId(CHAPTERS[(idx + 1) % CHAPTERS.length].id)
    } else if (e.key === 'ArrowLeft') {
      setActiveId(CHAPTERS[(idx - 1 + CHAPTERS.length) % CHAPTERS.length].id)
    }
  }

  return (
    <section id="guide" className="bg-bg scroll-mt-[120px]">
      <div className="max-w-[1280px] mx-auto px-6 pt-16 pb-8">
        <div className="font-mono text-[11px] tracking-[0.24em] uppercase text-accent mb-3">초심자 가이드</div>
        <h2
          className="font-archivo font-black uppercase leading-[0.95] tracking-[-0.02em]"
          style={{ fontSize: 'clamp(30px,4.4vw,52px)' }}
        >
          F1, 하나씩 알아가기
        </h2>
        <p className="text-text-muted text-base leading-[1.7] mt-4 max-w-[64ch]">
          규칙을 몰라도 레이스는 보입니다. 궁금한 챕터부터 골라 필요한 만큼만 읽어보세요.
        </p>
      </div>

      <div className="bg-bg-dark border-y border-border-dark">
        <div className="max-w-[1280px] mx-auto px-6">
          <div
            role="tablist"
            aria-label="F1 가이드 챕터"
            className="flex overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {CHAPTERS.map((tab) => {
              const isActive = tab.id === activeId
              return (
                <button
                  key={tab.id}
                  role="tab"
                  id={`${baseId}-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`${baseId}-panel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(tab.id)}
                  onKeyDown={(e) => handleKeyDown(e, tab.id)}
                  className={`flex flex-col items-center gap-[3px] px-6 py-4 cursor-pointer bg-transparent border-0 border-b-[3px] whitespace-nowrap flex-shrink-0 transition-colors duration-150 ${
                    isActive ? 'border-accent text-text-inv' : 'border-transparent text-text-muted'
                  }`}
                >
                  {tab.eyebrow && (
                    <span
                      className={`font-mono text-[9px] tracking-[0.15em] uppercase transition-colors duration-150 ${
                        isActive ? 'text-accent' : 'text-text-muted'
                      }`}
                    >
                      {tab.eyebrow}
                    </span>
                  )}
                  <span className="font-mono text-xs font-bold tracking-[0.06em] uppercase">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${activeChapter.id}`}
        aria-labelledby={`${baseId}-tab-${activeChapter.id}`}
      >
        {activeChapter.content}
      </div>
    </section>
  )
}
