'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import type { CornerAnalysisData } from '@/features/f1/cornerAnalysisBuild'
import type { CornerDef } from '@/features/f1/cornerAnalysis'
import { deltaToColor, CORNER_TYPE_MARKER, UNAVAILABLE_COLOR } from '@/features/f1/cornerColor'
import { CORNER_TYPE_LABELS, CORNER_TYPE_TO_AXIS, type AnalysisAxis } from '@/features/f1/cornerAxis'
import {
  fieldMedianByCorner,
  fieldMedianByStraight,
  maxAbsDeltaByCornerType,
  maxAbsDeltaForStraights,
  buildIndexToD,
  pointsInDRange,
} from '@/features/f1/cornerAnalysisMapUtils'

interface CornerTrackMapProps {
  data: CornerAnalysisData
  selectedTeam: string
  axis: AnalysisAxis
  onPickCorner: (cornerIndex: number) => void
  pickedCornerIndex: number | null
}

const MAX_ZOOM = 8
const DRAG_THRESHOLD = 4
const MARKER_R = 9

interface ViewBox { x: number; y: number; w: number; h: number }

interface HoverInfo {
  corner: CornerDef
  value: number | null
  delta: number | null
  soloDriverCode?: string
}

export default function CornerTrackMap({
  data,
  selectedTeam,
  axis,
  onPickCorner,
  pickedCornerIndex,
}: CornerTrackMapProps) {
  const VIEW = data.bounds.viewBox
  const [vb, setVb] = useState<ViewBox>({ x: 0, y: 0, w: VIEW, h: VIEW })
  const [hover, setHover] = useState<HoverInfo | null>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; startVb: ViewBox; moved: boolean } | null>(null)

  const team = useMemo(
    () => data.teams.find((t) => t.teamName === selectedTeam),
    [data.teams, selectedTeam],
  )

  const fieldMedianCorner = useMemo(() => fieldMedianByCorner(data.teams), [data.teams])
  const fieldMedianStraight = useMemo(() => fieldMedianByStraight(data.teams), [data.teams])
  const maxAbsCornerType = useMemo(
    () => maxAbsDeltaByCornerType(data.teams, data.corners, fieldMedianCorner),
    [data.teams, data.corners, fieldMedianCorner],
  )
  const maxAbsStraight = useMemo(
    () => maxAbsDeltaForStraights(data.teams, fieldMedianStraight),
    [data.teams, fieldMedianStraight],
  )
  const indexToD = useMemo(
    () => buildIndexToD(data.trackPath, data.corners),
    [data.trackPath, data.corners],
  )

  const isZoomed = vb.w < VIEW || vb.x !== 0 || vb.y !== 0

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
    if (!drag.moved && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) drag.moved = true
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

  const trackPoints = useMemo(() => {
    const pts = data.trackPath
    if (pts.length === 0) return ''
    return [...pts, pts[0]].map((p) => `${p.x},${p.y}`).join(' ')
  }, [data.trackPath])

  const straightOverlays = useMemo(() => {
    if (axis !== 'straight' || !team) return []
    return data.straights.flatMap((straight) => {
      const metric = team.straights.find((s) => s.straightIndex === straight.index)
      if (!metric || metric.topSpeedMedian == null) return []
      const fieldMedian = fieldMedianStraight.get(straight.index)
      if (fieldMedian == null) return []
      const delta = metric.topSpeedMedian - fieldMedian
      const color = deltaToColor(delta, maxAbsStraight)
      const segments = pointsInDRange(data.trackPath, indexToD, straight.startD, straight.endD)
      return segments.map((segment, i) => ({
        key: `${straight.index}-${i}`,
        points: segment.map((p) => `${p.x},${p.y}`).join(' '),
        color,
      }))
    })
  }, [axis, team, data.straights, data.trackPath, indexToD, fieldMedianStraight, maxAbsStraight])

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
        aria-label="코너 강점 분석 트랙맵"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <polyline points={trackPoints} fill="none" stroke="#3A352C" strokeWidth={6} strokeLinejoin="round" />

        {straightOverlays.map((seg) => (
          <polyline
            key={seg.key}
            points={seg.points}
            fill="none"
            stroke={seg.color}
            strokeWidth={10}
            strokeLinecap="round"
            style={{ pointerEvents: 'none' }}
          />
        ))}

        {data.corners.map((corner) => {
          const metric = team?.corners.find((m) => m.cornerIndex === corner.index)
          const value = metric?.apexSpeedMedian ?? null
          const fieldMedian = fieldMedianCorner.get(corner.index) ?? null
          const delta = value != null ? value - (fieldMedian ?? value) : null
          const matchesAxis = CORNER_TYPE_TO_AXIS[corner.type] === axis
          const isPicked = corner.index === pickedCornerIndex

          const color =
            value == null ? UNAVAILABLE_COLOR : deltaToColor(delta ?? 0, maxAbsCornerType[corner.type])

          return (
            <g
              key={corner.index}
              style={{ opacity: value == null ? 1 : matchesAxis ? 1 : 0.35 }}
            >
              <CornerMarker corner={corner} color={color} unavailable={value == null} picked={isPicked} />
              <circle
                cx={corner.apexX}
                cy={corner.apexY}
                r={14}
                fill="transparent"
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => {
                  if (!dragRef.current?.moved) {
                    setHover({ corner, value, delta, soloDriverCode: metric?.soloDriverCode })
                  }
                }}
                onMouseLeave={() => setHover(null)}
                onClick={() => {
                  if (dragRef.current?.moved) return
                  onPickCorner(corner.index)
                }}
              />
            </g>
          )
        })}
      </svg>

      {hover && (
        <CornerTooltip
          leftPct={hover.corner.apexX / (VIEW / 100)}
          topPct={hover.corner.apexY / (VIEW / 100)}
          info={hover}
        />
      )}
    </div>
  )
}

// ─── Marker shapes ────────────────────────────────────────────────────────────

interface CornerMarkerProps {
  corner: CornerDef
  color: string
  unavailable: boolean
  picked: boolean
}

function CornerMarker({ corner, color, unavailable, picked }: CornerMarkerProps) {
  const { apexX: cx, apexY: cy, type } = corner
  const shape = CORNER_TYPE_MARKER[type]
  const fill = unavailable ? 'none' : color
  const stroke = unavailable ? UNAVAILABLE_COLOR : picked ? '#fff' : color
  const strokeWidth = unavailable ? 2 : picked ? 3 : 1.5

  if (shape === 'diamond') {
    const points = [
      `${cx},${cy - MARKER_R}`,
      `${cx + MARKER_R},${cy}`,
      `${cx},${cy + MARKER_R}`,
      `${cx - MARKER_R},${cy}`,
    ].join(' ')
    return <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} style={{ pointerEvents: 'none' }} />
  }

  if (shape === 'square') {
    const size = MARKER_R * 1.5
    return (
      <rect
        x={cx - size / 2}
        y={cy - size / 2}
        width={size}
        height={size}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ pointerEvents: 'none' }}
      />
    )
  }

  return (
    <circle cx={cx} cy={cy} r={MARKER_R} fill={fill} stroke={stroke} strokeWidth={strokeWidth} style={{ pointerEvents: 'none' }} />
  )
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

interface CornerTooltipProps {
  leftPct: number
  topPct: number
  info: HoverInfo
}

function CornerTooltip({ leftPct, topPct, info }: CornerTooltipProps) {
  const flipX = leftPct > 60
  const flipY = topPct < 18
  const { corner, value, delta, soloDriverCode } = info

  return (
    <div
      style={{
        position: 'absolute',
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: `translate(${flipX ? 'calc(-100% - 12px)' : '12px'}, ${flipY ? '12px' : 'calc(-100% - 12px)'})`,
        zIndex: 20,
        pointerEvents: 'none',
        background: '#15120D',
        border: '1px solid #2C271F',
        borderRadius: 4,
        padding: '8px 10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        whiteSpace: 'nowrap',
        fontFamily: "'Space Mono', monospace",
      }}
    >
      <div style={{ fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#857A6A', marginBottom: 4 }}>
        코너 {corner.index} · {CORNER_TYPE_LABELS[corner.type]}
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: '#F5F0E8' }}>
        {value != null ? `${value.toFixed(1)} km/h` : '표본 부족'}
      </div>
      {delta != null && (
        <div style={{ fontSize: 11, color: delta >= 0 ? '#22C55E' : '#EF4444' }}>
          필드 대비 {delta >= 0 ? '+' : ''}
          {delta.toFixed(1)} km/h
        </div>
      )}
      {soloDriverCode && (
        <div style={{ fontSize: 10, color: '#857A6A', marginTop: 2 }}>{soloDriverCode} 1인 데이터</div>
      )}
    </div>
  )
}
