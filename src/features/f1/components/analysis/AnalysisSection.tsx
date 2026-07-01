'use client'

import { useState, useId } from 'react'
import type { AnalysisTabItem } from './types'

const BG = '#15120D'
const BORDER = '#2C271F'
const TEXT = '#F5F0E8'
const MUTED = '#857A6A'
const RED = '#E10600'

export interface AnalysisSectionProps {
  tabs: AnalysisTabItem[]
  defaultTabId?: string
}

export default function AnalysisSection({ tabs, defaultTabId }: AnalysisSectionProps) {
  const baseId = useId()
  const [activeId, setActiveId] = useState(() => defaultTabId ?? tabs[0]?.id ?? '')

  if (tabs.length === 0) return null

  const showTabBar = tabs.length > 1

  function handleKeyDown(e: React.KeyboardEvent, tabId: string) {
    const idx = tabs.findIndex((t) => t.id === tabId)
    if (e.key === 'ArrowRight') {
      setActiveId(tabs[(idx + 1) % tabs.length].id)
    } else if (e.key === 'ArrowLeft') {
      setActiveId(tabs[(idx - 1 + tabs.length) % tabs.length].id)
    }
  }

  return (
    <section id="analysis">
      {showTabBar && (
        <div
          style={{
            background: BG,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
            <div
              role="tablist"
              aria-label="분석 섹션"
              style={{
                display: 'flex',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {tabs.map((tab) => {
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
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3,
                      padding: '16px 24px',
                      cursor: 'pointer',
                      background: 'none',
                      border: 'none',
                      borderBottom: `3px solid ${isActive ? RED : 'transparent'}`,
                      color: isActive ? TEXT : MUTED,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'color 0.15s, border-color 0.15s',
                    }}
                  >
                    {tab.eyebrow && (
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: 9,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase' as const,
                          color: isActive ? RED : MUTED,
                          transition: 'color 0.15s',
                        }}
                      >
                        {tab.eyebrow}
                      </span>
                    )}
                    <span
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase' as const,
                      }}
                    >
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* 모든 패널을 마운트 유지 — 비활성 탭은 display:none으로 숨겨 상태 보존 */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          style={{ display: tab.id === activeId ? 'block' : 'none' }}
        >
          {tab.content}
        </div>
      ))}
    </section>
  )
}
