'use client'

import { useEffect, useRef, useState } from 'react'

type SegColor = 'p' | 'g' | 'y'

const SEG_COLORS: Record<SegColor, string> = {
  p: '#b45cff',
  g: '#2fd27a',
  y: '#f4c13b',
}

const INITIAL_ROWS: { pos: number; drv: string; team: string; segs: SegColor[]; time: string; isLead: boolean; isP: boolean }[] = [
  { pos: 1, drv: 'VER', team: 'Red Bull',  segs: ['p', 'g', 'p'], time: '1:18.204', isLead: true,  isP: true  },
  { pos: 2, drv: 'NOR', team: 'McLaren',   segs: ['g', 'p', 'y'], time: '+1.6',     isLead: false, isP: false },
  { pos: 3, drv: 'LEC', team: 'Ferrari',   segs: ['y', 'g', 'g'], time: '+4.0',     isLead: false, isP: false },
  { pos: 4, drv: 'RUS', team: 'Mercedes',  segs: ['g', 'y', 'p'], time: '+7.3',     isLead: false, isP: false },
]

const ALL_COLORS: SegColor[] = ['p', 'g', 'y']

export default function TimingTower() {
  const [rows, setRows] = useState(INITIAL_ROWS)
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion.current) return

    const id = setInterval(() => {
      setRows((prev) => {
        const next = prev.map((r) => ({ ...r, segs: [...r.segs] as SegColor[] }))
        const ri = Math.floor(Math.random() * next.length)
        const si = Math.floor(Math.random() * 3)
        next[ri].segs[si] = ALL_COLORS[Math.floor(Math.random() * 3)]
        return next
      })
    }, 1100)

    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ background: 'linear-gradient(180deg,#171a22,#13161d)', border: '1px solid #2a2f3b', borderRadius: 10, padding: '16px 16px 14px', boxShadow: '0 30px 60px -30px rgba(0,0,0,.8)', fontFamily: "'Space Mono', monospace" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px 12px', borderBottom: '1px solid #2a2f3b', marginBottom: 8 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, letterSpacing: '0.18em', color: '#969ba6', textTransform: 'uppercase' }}>
          <span className="f1-live-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#ff2e55', display: 'inline-block' }} />
          Live Timing
        </span>
        <span style={{ fontSize: 11, color: '#969ba6' }}>LAP 38 / 58</span>
      </div>

      {rows.map((row) => (
        <div key={row.pos} style={{ display: 'grid', gridTemplateColumns: '22px 1fr 28px 28px 28px 60px', alignItems: 'center', gap: 8, padding: '7px 4px', fontSize: 13, borderRadius: 5, background: row.isLead ? 'rgba(180,92,255,.07)' : 'transparent' }}>
          <span style={{ color: '#969ba6', fontSize: 12, textAlign: 'center' }}>{row.pos}</span>
          <span style={{ fontWeight: 700, color: '#edeff2' }}>
            {row.drv}
            <small style={{ color: '#6b707b', fontWeight: 400, marginLeft: 6, fontSize: 11 }}>{row.team}</small>
          </span>
          {row.segs.map((seg, i) => (
            <div key={i} style={{ height: 6, borderRadius: 2, background: SEG_COLORS[seg], transition: 'background .3s ease' }} />
          ))}
          <span style={{ textAlign: 'right', color: row.isP ? '#b45cff' : '#edeff2', fontWeight: 500, fontSize: 13 }}>{row.time}</span>
        </div>
      ))}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 12, paddingTop: 11, borderTop: '1px solid #2a2f3b', fontSize: 11, color: '#969ba6' }}>
        {([['#b45cff', '전체 최고 구간'], ['#2fd27a', '자기 최고'], ['#f4c13b', '평소 페이스']] as [string, string][]).map(([color, label]) => (
          <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 18, height: 6, borderRadius: 2, background: color, display: 'inline-block' }} />{label}
          </span>
        ))}
      </div>
      <p style={{ marginTop: 14, fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, color: '#969ba6', lineHeight: 1.55 }}>
        처음엔 외계어처럼 보이죠? <strong style={{ color: '#edeff2' }}>색이 곧 정보</strong>예요. 보라색 구간이 많은 차가 지금 가장 빠르다는 뜻. 이 가이드를 다 보면 이 보드가 읽힙니다.
      </p>
    </div>
  )
}
