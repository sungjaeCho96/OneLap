import type { ReactNode } from 'react'

export function SecHead({ num, title, sub }: { num: string; title: string; sub: string }) {
  return (
    <div className="mb-9">
      <div className="flex flex-wrap items-center gap-3.5 mb-2.5">
        <span className="font-mono text-[11px] font-bold text-accent border border-border rounded-sm px-[9px] py-1">
          {num}
        </span>
        <h2
          className="font-noto font-black leading-[1.15] tracking-[-0.01em]"
          style={{ fontSize: 'clamp(22px,3.4vw,34px)' }}
        >
          {title}
        </h2>
      </div>
      <p className="text-[15px] text-text-muted max-w-[60ch] leading-[1.6]">{sub}</p>
    </div>
  )
}

export function Hl({ children }: { children: ReactNode }) {
  return <span className="font-bold text-text">{children}</span>
}
