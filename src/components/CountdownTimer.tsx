'use client'

import { useEffect, useState } from 'react'

interface CountdownTimerProps {
  targetTs: number
}

interface CountUnit {
  label: string
  value: string
}

function calcCountdown(targetTs: number, now: number): CountUnit[] {
  const diff = Math.max(0, targetTs - now)
  const dsec = Math.floor(diff / 1000)
  const d = Math.floor(dsec / 86400)
  const h = Math.floor((dsec % 86400) / 3600)
  const m = Math.floor((dsec % 3600) / 60)
  const s = dsec % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  return [
    { label: 'Days', value: String(d) },
    { label: 'Hrs', value: pad(h) },
    { label: 'Min', value: pad(m) },
    { label: 'Sec', value: pad(s) },
  ]
}

export default function CountdownTimer({ targetTs }: CountdownTimerProps) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  const units = calcCountdown(targetTs, now)

  return (
    <div>
      <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted mb-3">
        출발까지
      </div>
      <div className="flex gap-2.5 flex-wrap">
        {units.map((u) => (
          <div
            key={u.label}
            className="bg-text text-text-inv px-[18px] py-3.5 min-w-[84px] text-center"
          >
            <div
              className="font-mono font-bold leading-none"
              style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}
            >
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
