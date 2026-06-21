'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetTs: number
  isLive?: boolean
}

export default function CountdownTimer({ targetTs, isLive = false }: CountdownTimerProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const pad = (n: number) => String(n).padStart(2, '0')

  if (isLive) {
    const esec = Math.floor(Math.max(0, now - targetTs) / 1000)
    const units = [
      { label: 'Hrs', value: pad(Math.floor(esec / 3600)) },
      { label: 'Min', value: pad(Math.floor((esec % 3600) / 60)) },
      { label: 'Sec', value: pad(esec % 60) },
    ]
    return (
      <div>
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted mb-3">
          경기 경과 시간
        </div>
        <div className="flex gap-2.5 flex-wrap">
          {units.map((u) => (
            <div key={u.label} className="bg-text text-text-inv px-[18px] py-3.5 min-w-[84px] text-center">
              <div className="font-mono font-bold leading-none" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
                {u.value}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim mt-2">
                {u.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const dsec = Math.floor(Math.max(0, targetTs - now) / 1000)
  const units = [
    { label: 'Days', value: String(Math.floor(dsec / 86400)) },
    { label: 'Hrs',  value: pad(Math.floor((dsec % 86400) / 3600)) },
    { label: 'Min',  value: pad(Math.floor((dsec % 3600) / 60)) },
    { label: 'Sec',  value: pad(dsec % 60) },
  ]

  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted mb-3">
        출발까지
      </div>
      <div className="flex gap-2.5 flex-wrap">
        {units.map((u) => (
          <div key={u.label} className="bg-text text-text-inv px-[18px] py-3.5 min-w-[84px] text-center">
            <div className="font-mono font-bold leading-none" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
              {u.value}
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-dim mt-2">
              {u.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
