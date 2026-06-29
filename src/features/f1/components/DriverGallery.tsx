'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback, useRef } from 'react'
import { F1_TEAMS, type F1Driver, type F1Team } from '@/lib/sports/f1Data'

// ─── 인터페이스 ───────────────────────────────────────────────────────────────

interface FlatDriver extends F1Driver {
  teamId: string
  teamNameKr: string
  teamColor: string
  teamFlag: string
  teamCountry: string
}

// ─── 전체 드라이버 평탄화 배열 (모달 순회용) ─────────────────────────────────

const ALL_DRIVERS: FlatDriver[] = F1_TEAMS.flatMap((team) =>
  team.drivers.map((driver) => ({
    ...driver,
    teamId: team.id,
    teamNameKr: team.nameKr,
    teamColor: team.color,
    teamFlag: team.teamFlag,
    teamCountry: team.teamCountry,
  }))
)

// ─── DriverModal ─────────────────────────────────────────────────────────────

interface DriverModalProps {
  driver: FlatDriver
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  isMobile: boolean
}

function DriverModal({ driver, onClose, onPrev, onNext, isMobile }: DriverModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [photoError, setPhotoError] = useState(false)

  // 드라이버 바뀔 때 스크롤 리셋 + 사진 에러 초기화
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
    setPhotoError(false)
  }, [driver.nameEn])

  const stopProp = (e: React.MouseEvent) => e.stopPropagation()

  const backdropStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: isMobile ? 'flex-end' : 'center',
    justifyContent: 'center',
  }

  const modalStyle: React.CSSProperties = {
    background: '#fff',
    maxWidth: 760,
    width: '92%',
    maxHeight: isMobile ? '92vh' : '90vh',
    borderRadius: isMobile ? '12px 12px 0 0' : 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    position: 'relative',
  }

  const photoAreaStyle: React.CSSProperties = isMobile
    ? {
        flexShrink: 0,
        height: 250,
        position: 'relative',
        background: `linear-gradient(135deg, ${driver.teamColor}44 0%, ${driver.teamColor}22 100%)`,
      }
    : {
        flex: '0 0 45%',
        position: 'relative',
        background: `linear-gradient(135deg, ${driver.teamColor}44 0%, ${driver.teamColor}22 100%)`,
        minHeight: 480,
      }

  const infoAreaStyle: React.CSSProperties = {
    flex: 1,
    overflowY: 'auto',
    padding: isMobile ? '20px 18px 28px' : '28px 28px 32px',
  }

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={modalStyle} onClick={stopProp}>
        {/* 사진 영역 */}
        <div style={photoAreaStyle}>
          {!photoError && (
            <Image
              src={driver.image}
              alt={driver.nameKr}
              fill
              sizes="(max-width: 640px) 92vw, 41vw"
              style={{ objectFit: 'cover', objectPosition: 'top center' }}
              onError={() => setPhotoError(true)}
            />
          )}
          {/* 번호 뱃지 — 우하단 */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            right: 14,
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 900,
            fontSize: isMobile ? 44 : 56,
            color: '#fff',
            lineHeight: 1,
            textShadow: `0 2px 12px rgba(0,0,0,0.45)`,
            letterSpacing: '-0.02em',
          }}>
            #{driver.num}
          </div>
        </div>

        {/* 정보 영역 */}
        <div ref={scrollRef} style={infoAreaStyle}>
          {/* 팀 라벨 */}
          <div style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            color: driver.teamColor,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            {driver.teamFlag} {driver.teamNameKr}
          </div>

          {/* 이름 KR */}
          <div style={{
            fontFamily: "'Noto Sans KR', sans-serif",
            fontWeight: 800,
            fontSize: isMobile ? 22 : 26,
            color: '#15120D',
            lineHeight: 1.2,
            marginBottom: 4,
          }}>
            {driver.nameKr}
          </div>

          {/* 이름 EN */}
          <div style={{
            fontFamily: "'Archivo', sans-serif",
            fontSize: 13,
            color: '#857A6A',
            marginBottom: 14,
            letterSpacing: '0.02em',
          }}>
            {driver.nameEn}
          </div>

          {/* 메타 칩 행 */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 6,
            marginBottom: 18,
          }}>
            {[
              `${driver.nationalityFlag} ${driver.nationalityKr}`,
              `만 ${driver.age}세`,
              `#${driver.num}`,
            ].map((chip) => (
              <span key={chip} style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 10,
                color: '#4A4338',
                background: '#EAE5DA',
                border: '1px solid #E0D9CB',
                borderRadius: 3,
                padding: '4px 8px',
                letterSpacing: '0.04em',
              }}>
                {chip}
              </span>
            ))}
          </div>

          {/* 인용구 storyKr */}
          <div style={{
            borderLeft: `4px solid ${driver.teamColor}`,
            paddingLeft: 14,
            marginBottom: 20,
            fontFamily: "'Noto Sans KR', sans-serif",
            fontStyle: 'italic',
            fontSize: 14,
            color: '#4A4338',
            lineHeight: 1.65,
            wordBreak: 'keep-all',
          }}>
            &ldquo;{driver.storyKr}&rdquo;
          </div>

          {/* 경력 섹션 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              color: '#857A6A',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              경력
            </div>
            <div style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: 13,
              color: '#15120D',
              lineHeight: 1.7,
              wordBreak: 'keep-all',
            }}>
              {driver.careerKr}
            </div>
          </div>

          {/* 2026 관전포인트 박스 */}
          <div style={{
            background: '#F2EFE8',
            borderLeft: `4px solid ${driver.teamColor}`,
            borderRadius: '0 4px 4px 0',
            padding: '12px 14px',
            marginBottom: 24,
          }}>
            <div style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              color: driver.teamColor,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              2026 관전포인트
            </div>
            <div style={{
              fontFamily: "'Noto Sans KR', sans-serif",
              fontSize: 13,
              color: '#15120D',
              lineHeight: 1.7,
              wordBreak: 'keep-all',
            }}>
              {driver.point2026Kr}
            </div>
          </div>

          {/* 이전/다음 내비게이션 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 8,
          }}>
            <button
              onClick={onPrev}
              style={{
                flex: 1,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#4A4338',
                background: '#EAE5DA',
                border: '1px solid #E0D9CB',
                borderRadius: 4,
                padding: '9px 12px',
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              ← 이전
            </button>
            <button
              onClick={onNext}
              style={{
                flex: 1,
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                color: '#fff',
                background: driver.teamColor,
                border: 'none',
                borderRadius: 4,
                padding: '9px 12px',
                cursor: 'pointer',
                letterSpacing: '0.04em',
              }}
            >
              다음 →
            </button>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.45)',
            border: 'none',
            color: '#fff',
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            zIndex: 10,
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// ─── DriverCard ───────────────────────────────────────────────────────────────

interface DriverCardProps {
  driver: F1Driver
  teamColor: string
  onClick: () => void
}

function DriverCard({ driver, teamColor, onClick }: DriverCardProps) {
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick()
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        background: '#D8D2C8',
        aspectRatio: '3/4',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        transform: hovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hovered ? `0 8px 24px rgba(0,0,0,0.18)` : '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
      }}
    >
      {!imgError && (
        <Image
          src={driver.image}
          alt={driver.nameKr}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          style={{ objectFit: 'cover', objectPosition: 'top center' }}
          onError={() => setImgError(true)}
        />
      )}
      {imgError && (
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: `${teamColor}18`,
        }}>
          <span style={{
            fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 52,
            color: `${teamColor}55`,
          }}>
            {driver.num}
          </span>
        </div>
      )}

      {/* 하단 그라디언트 */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.3) 38%, transparent 62%)',
        pointerEvents: 'none',
        transition: 'opacity 0.18s ease',
        opacity: hovered ? 0.85 : 1,
      }} />

      {/* 번호 뱃지 */}
      <div style={{
        position: 'absolute', top: 9, left: 9,
        fontFamily: "'Archivo', sans-serif", fontWeight: 900, fontSize: 12,
        color: '#fff', background: teamColor,
        padding: '3px 7px', borderRadius: 2, lineHeight: 1,
        letterSpacing: '0.02em',
      }}>
        {driver.num}
      </div>

      {/* 이름 영역 */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '10px 12px 13px',
      }}>
        <div style={{
          fontFamily: "'Space Mono', monospace", fontSize: 9,
          color: 'rgba(255,255,255,0.65)', marginBottom: 4, letterSpacing: '0.04em',
        }}>
          {driver.nationalityFlag} {driver.nationalityKr.toUpperCase()}
        </div>
        <div style={{
          fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700,
          fontSize: 13, color: '#fff', lineHeight: 1.3,
          wordBreak: 'keep-all',
        }}>
          {driver.nameKr}
        </div>

        {/* hover 마이크로카피 */}
        <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: 'rgba(255,255,255,0.75)',
          marginTop: 5,
          letterSpacing: '0.05em',
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(4px)',
          transition: 'opacity 0.18s ease, transform 0.18s ease',
        }}>
          자세히 보기 ▸
        </div>
      </div>
    </div>
  )
}

// ─── TeamLogo ─────────────────────────────────────────────────────────────────

interface TeamLogoProps {
  team: F1Team
}

function TeamLogo({ team }: TeamLogoProps) {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <div style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        background: team.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 900,
          fontSize: 8,
          color: '#fff',
          letterSpacing: '0.02em',
        }}>
          {team.nameShort}
        </span>
      </div>
    )
  }

  return (
    <Image
      src={team.logo}
      alt={team.nameShort}
      width={28}
      height={28}
      onError={() => setImgError(true)}
      style={{ objectFit: 'contain', flexShrink: 0 }}
    />
  )
}

// ─── DriverGallery (메인) ─────────────────────────────────────────────────────

export default function DriverGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // 모바일 감지 (SSR 안전)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // 스크롤 락
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedIndex])

  const handleClose = useCallback(() => setSelectedIndex(null), [])

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null
      return (prev - 1 + ALL_DRIVERS.length) % ALL_DRIVERS.length
    })
  }, [])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null
      return (prev + 1) % ALL_DRIVERS.length
    })
  }, [])

  // 키보드 인터랙션
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIndex, handleClose, handlePrev, handleNext])

  const selectedDriver = selectedIndex !== null ? ALL_DRIVERS[selectedIndex] : null

  return (
    <>
      <div style={{ marginTop: 32 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 12,
        }}>
          {F1_TEAMS.map((team) => (
            <div
              key={team.id}
              style={{
                background: '#fff',
                border: '1px solid #E0D9CB',
                borderRadius: 4,
                overflow: 'hidden',
              }}
            >
              {/* 팀 헤더 */}
              <div style={{
                padding: '11px 14px',
                borderLeft: `4px solid ${team.color}`,
                borderBottom: '1px solid #E0D9CB',
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#FAFAF8',
              }}>
                <TeamLogo team={team} />
                <div>
                  <div style={{
                    fontFamily: "'Noto Sans KR', sans-serif", fontWeight: 700,
                    fontSize: 13, color: '#15120D', lineHeight: 1,
                  }}>
                    {team.nameKr}
                  </div>
                  <div style={{
                    fontFamily: "'Space Mono', monospace", fontSize: 9,
                    color: '#857A6A', letterSpacing: '0.06em', marginTop: 3,
                  }}>
                    {team.teamCountry.toUpperCase()}
                  </div>
                </div>
              </div>

              {/* 드라이버 카드 2개 */}
              <div style={{ display: 'flex', gap: 8, padding: 10 }}>
                {team.drivers.map((driver) => {
                  const flatIndex = ALL_DRIVERS.findIndex(
                    (d) => d.teamId === team.id && d.num === driver.num
                  )
                  return (
                    <DriverCard
                      key={driver.num}
                      driver={driver}
                      teamColor={team.color}
                      onClick={() => setSelectedIndex(flatIndex)}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {selectedDriver !== null && selectedIndex !== null && (
        <DriverModal
          driver={selectedDriver}
          onClose={handleClose}
          onPrev={handlePrev}
          onNext={handleNext}
          isMobile={isMobile}
        />
      )}
    </>
  )
}
