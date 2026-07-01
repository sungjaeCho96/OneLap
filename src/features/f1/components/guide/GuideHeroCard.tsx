import { SERIES_MAP } from '@/lib/data'

export default function GuideHeroCard() {
  const s = SERIES_MAP.f1

  return (
    <div className="bg-white border border-border flex flex-col overflow-hidden">
      <div className="h-1.5" style={{ background: s.color }} />

      <div className="p-6 pb-[22px] flex flex-col">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div
              className="font-archivo font-black text-[30px] leading-none tracking-[-0.02em]"
              style={{ color: s.color }}
            >
              {s.short}
            </div>
            <div className="font-archivo font-extrabold text-[17px] uppercase mt-2">{s.name}</div>
            <div className="text-[13px] text-text-muted mt-0.5">{s.kr}</div>
          </div>
          <span
            className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] border px-2 py-1 whitespace-nowrap flex-none mt-1"
            style={{ color: s.color, borderColor: s.color }}
          >
            {s.tag}
          </span>
        </div>

        <p className="text-sm leading-[1.6] text-text-mid mb-5">{s.blurb}</p>

        <div
          className="grid gap-px"
          style={{ gridTemplateColumns: '1fr 1fr', background: '#E8E2D5', border: '1px solid #E8E2D5' }}
        >
          {s.facts.map(([label, value]) => (
            <div key={label} className="bg-white px-3 py-2.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">{label}</div>
              <div className="text-[13px] font-bold mt-[3px]">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
