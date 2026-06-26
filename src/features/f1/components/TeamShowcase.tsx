'use client'

import { useState } from 'react'
import { F1_TEAMS } from '@/lib/sports/f1Data'

export default function TeamShowcase() {
  const [activeId, setActiveId] = useState<string>('redbull')
  const [imgError, setImgError] = useState<Record<string, boolean>>({})
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const activeTeam = F1_TEAMS.find((t) => t.id === activeId) ?? F1_TEAMS[0]

  return (
    <div style={{ marginTop: 32, border: '1px solid #E0D9CB', borderRadius: 4, overflow: 'hidden' }}>

      {/* 헤더 */}
      <div style={{ background: '#15120D', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>2026 GRID</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#4A3F35' }}>·</span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#4A3F35', letterSpacing: '0.06em' }}>11 TEAMS</span>
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#4A3F35', letterSpacing: '0.06em' }}>팀 로고를 눌러 상세 정보 확인</span>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* 로고 그리드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
          {F1_TEAMS.map((team) => {
            const isActive = team.id === activeId
            const isHovered = hoveredId === team.id
            return (
              <button
                key={team.id}
                onClick={() => setActiveId(team.id)}
                onMouseEnter={() => setHoveredId(team.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  background: isActive ? '#fff' : isHovered ? '#fafaf8' : '#F2EFE8',
                  border: `2px solid ${isActive ? team.color : isHovered ? team.color + '66' : '#E0D9CB'}`,
                  borderRadius: 4,
                  padding: '12px 8px 10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transform: isHovered && !isActive ? 'translateY(-2px)' : 'none',
                  boxShadow: isActive ? `0 4px 16px ${team.color}33` : 'none',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                {isActive && (
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: team.color, borderRadius: '2px 2px 0 0',
                  }} />
                )}
                <div style={{
                  width: 44, height: 44, borderRadius: 4, margin: '0 auto 8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  {imgError[team.id] ? (
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: team.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 9,
                      color: '#fff',
                    }}>
                      {team.nameShort}
                    </div>
                  ) : (
                    <img
                      src={team.logo}
                      alt={team.nameKr}
                      loading="lazy"
                      onError={() => setImgError((prev) => ({ ...prev, [team.id]: true }))}
                      style={{ width: 36, height: 36, objectFit: 'contain' }}
                    />
                  )}
                </div>
                <div style={{
                  fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700, fontSize: 10,
                  color: isActive ? '#15120D' : '#4A4338', lineHeight: 1.3,
                  wordBreak: 'keep-all',
                }}>
                  {team.nameKr}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* 상세 패널 */}
      <div
        key={activeId}
        style={{
          margin: 20,
          background: '#fff',
          border: '1px solid #E0D9CB',
          borderLeft: `4px solid ${activeTeam.color}`,
          borderRadius: 4,
          padding: '22px 24px',
        }}
      >
        {/* 팀명 + 국기 */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{activeTeam.teamFlag}</span>
              <span style={{
                fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
                color: activeTeam.color, letterSpacing: '0.08em', border: `1px solid ${activeTeam.color}33`,
                padding: '2px 8px', borderRadius: 2,
              }}>
                {activeTeam.teamCountry}
              </span>
            </div>
            <h3 style={{ fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 900, fontSize: 22, lineHeight: 1.1, marginBottom: 2 }}>
              {activeTeam.nameKr}
            </h3>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#857A6A', letterSpacing: '0.08em' }}>
              {activeTeam.fullName}
            </div>
          </div>

          {/* 드라이버 */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {activeTeam.drivers.map((d) => (
              <div
                key={d.num}
                style={{
                  background: '#F2EFE8', borderRadius: 4, padding: '10px 14px',
                  display: 'flex', alignItems: 'center', gap: 8, minWidth: 140,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: activeTeam.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Space Mono', monospace", fontWeight: 700, fontSize: 10,
                  color: '#fff',
                }}>
                  {d.num}
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#857A6A', letterSpacing: '0.08em', marginBottom: 2 }}>DRIVER</div>
                  <div style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>{d.nameKr}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 팀 특징 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700, color: '#857A6A', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7 }}>
            팀 특징
          </div>
          <p style={{ fontSize: 14, color: '#3A352C', lineHeight: 1.7 }}>
            {activeTeam.trait}
          </p>
        </div>

        {/* 관전 포인트 */}
        <div style={{
          background: `${activeTeam.color}08`,
          border: `1px solid ${activeTeam.color}33`,
          borderLeft: `3px solid ${activeTeam.color}`,
          borderRadius: 2, padding: '14px 16px',
        }}>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 10, fontWeight: 700,
            color: activeTeam.color, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 7,
          }}>
            초심자 관전 포인트
          </div>
          <p style={{ fontSize: 14, color: '#3A352C', lineHeight: 1.7 }}>
            {activeTeam.watchPoint}
          </p>
        </div>
      </div>

    </div>
  )
}
