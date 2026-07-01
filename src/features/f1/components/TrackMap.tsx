'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import type { TrackSpeedData } from '@/features/f1/trackSpeed'
import { findClosestByD } from '@/features/f1/trackSpeed'
import {
  interpolateSpeedAtD,
  pickFasterColor,
  TIE_COLOR,
  SPEED_TIE_THRESHOLD,
} from '@/features/f1/speedColor'
import type { DriverColorPair } from '@/features/f1/speedColor'
import SpeedTooltip from './SpeedTooltip'

interface TrackMapProps {
  data: TrackSpeedData
  driverColors: DriverColorPair
  tieColor?: string
  pinnedD: number | null
  onPick: (d: number) => void
}

const MAX_ZOOM = 8
const DRAG_THRESHOLD = 4

interface ViewBox { x: number; y: number; w: number; h: number }

export default function TrackMap({
  data,
  driverColors,
  tieColor = TIE_COLOR,
  pinnedD,
  onPick,
}: TrackMapProps) {
  const [hoverD, setHoverD] = useState<number | null>(null)
  const { bounds } = data
  const VIEW = bounds.viewBox

  const [vb, setVb] = useState<ViewBox>({ x: 0, y: 0, w: VIEW, h: VIEW })
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{
    startX: number
    startY: number
    startVb: ViewBox
    moved: boolean
  } | null>(null)

  const ref = data.drivers[0].points
  const other = data.drivers[1].points
  const [colorRef, colorOther] = driverColors

  const pinnedIdx = pinnedD != null
    ? ref.reduce<number>((best, p, i) => {
        const diff = Math.abs(p.d - pinnedD)
        const bestDiff = Math.abs(ref[best].d - pinnedD)
        return diff < bestDiff ? i : best
      }, 0)
    : null

  const hoverPtA = hoverD != null ? findClosestByD(ref, hoverD) : null
  const hoverPtB = hoverD != null ? findClosestByD(other, hoverD) : null

  const isZoomed = vb.w < VIEW || vb.x !== 0 || vb.y !== 0

  // passive: false 가 필요하므로 useEffect에서 직접 등록
  useEffect(() => {
    const el = svgRef.current
    if (!el) return

    function handleWheel(e: WheelEvent) {
      e.preventDefault()
      const rect = el!.getBoundingClientRect()
      const mx = (e.clientX - rect.left) / rect.width
      const my = (e.clientY - rect.top) / rect.height

      setVb((prev) => {
        const pivotX = prev.x + mx * prev.w
        const pivotY = prev.y + my * prev.h
        const factor = e.deltaY > 0 ? 1.15 : 1 / 1.15
        const newW = Math.min(Math.max(prev.w * factor, VIEW / MAX_ZOOM), VIEW)
        const newH = Math.min(Math.max(prev.h * factor, VIEW / MAX_ZOOM), VIEW)
        const newX = Math.max(0, Math.min(pivotX - mx * newW, VIEW - newW))
        const newY = Math.max(0, Math.min(pivotY - my * newH, VIEW - newH))
        return { x: newX, y: newY, w: newW, h: newH }
      })
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    return () => el.removeEventListener('wheel', handleWheel)
  }, [VIEW])

  const onMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY, startVb: vb, moved: false }
    if (svgRef.current) svgRef.current.style.cursor = 'grabbing'
  }, [vb])

  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const svgEl = svgRef.current
    if (!svgEl) return

    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY

    if (!drag.moved && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
      drag.moved = true
    }
    if (!drag.moved) return

    const rect = svgEl.getBoundingClientRect()
    const svgDx = (dx / rect.width) * drag.startVb.w
    const svgDy = (dy / rect.height) * drag.startVb.h
    const { startVb } = drag
    const newX = Math.max(0, Math.min(startVb.x - svgDx, VIEW - startVb.w))
    const newY = Math.max(0, Math.min(startVb.y - svgDy, VIEW - startVb.h))
    setVb({ ...startVb, x: newX, y: newY })
  }, [VIEW])

  const onMouseUp = useCallback(() => {
    dragRef.current = null
    if (svgRef.current) svgRef.current.style.cursor = 'grab'
  }, [])

  const resetZoom = useCallback(() => setVb({ x: 0, y: 0, w: VIEW, h: VIEW }), [VIEW])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {isZoomed && (
        <button
          onClick={resetZoom}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10,
            fontFamily: "'Space Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#857A6A',
            background: 'rgba(21,18,13,0.9)',
            border: '1px solid #2C271F',
            padding: '4px 8px',
            cursor: 'pointer',
            borderRadius: 2,
          }}
        >
          RESET ZOOM
        </button>
      )}

      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
        style={{
          width: '100%',
          height: '100%',
          background: '#15120D',
          borderRadius: 4,
          display: 'block',
          cursor: 'grab',
          userSelect: 'none',
        }}
        aria-label="트랙 속도 맵"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* 세그먼트별 색상 — 더 빠른 드라이버 고정색 방식 */}
        {ref.slice(0, -1).map((p, i) => {
          const next = ref[i + 1]
          const refSpeed = (p.speed + next.speed) / 2
          const dMid = (p.d + next.d) / 2
          const otherSpeed = interpolateSpeedAtD(other, dMid)
          const stroke = pickFasterColor(
            refSpeed,
            otherSpeed,
            colorRef,
            colorOther,
            tieColor,
            SPEED_TIE_THRESHOLD,
          )
          return (
            <line
              key={i}
              x1={p.x}
              y1={p.y}
              x2={next.x}
              y2={next.y}
              stroke={stroke}
              strokeWidth={10}
              strokeLinecap="round"
            />
          )
        })}

        {/* Always-visible comparison markers */}
        {ref.map((p, i) => {
          if (i % 20 !== 0) return null
          const isActive = i === pinnedIdx
          return (
            <circle
              key={`marker-${p.d}`}
              cx={p.x}
              cy={p.y}
              r={isActive ? 10 : 6}
              fill="#15120D"
              stroke={isActive ? '#fff' : 'rgba(255,255,255,0.85)'}
              strokeWidth={isActive ? 2.5 : 2}
              style={{ pointerEvents: 'none' }}
            />
          )
        })}

        {/* Hit targets */}
        {ref
          .filter((_, i) => i % 20 === 0)
          .map((p) => (
            <circle
              key={p.d}
              cx={p.x}
              cy={p.y}
              r={14}
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => {
                if (!dragRef.current?.moved) setHoverD(p.d)
              }}
              onMouseLeave={() => setHoverD(null)}
              onClick={() => {
                if (dragRef.current?.moved) return
                onPick(p.d)
              }}
            />
          ))}
      </svg>

      {/* Floating tooltip */}
      {hoverPtA && hoverPtB && (
        <SpeedTooltip
          leftPct={hoverPtA.x / 10}
          topPct={hoverPtA.y / 10}
          rowA={{ code: data.drivers[0].code, color: colorRef, speed: hoverPtA.speed, gear: hoverPtA.gear }}
          rowB={{ code: data.drivers[1].code, color: colorOther, speed: hoverPtB.speed, gear: hoverPtB.gear }}
        />
      )}
    </div>
  )
}
