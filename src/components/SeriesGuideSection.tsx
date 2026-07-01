import Link from 'next/link'
import type { Series } from '@/types'

interface SeriesGuideSectionProps {
  series: Series[]
}

export default function SeriesGuideSection({ series }: SeriesGuideSectionProps) {
  return (
    <section id="series" className="mx-auto max-w-[1280px] px-6 py-[72px] scroll-mt-[120px]">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-3.5">
        <div className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted">
          시작하기
        </div>
        <div className="font-mono text-xs text-text-muted">{String(series.length).padStart(2, '0')} 종목</div>
      </div>
      <h2
        className="font-archivo font-black uppercase leading-[0.95] tracking-[-0.03em] mb-9"
        style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
      >
        모터스포츠를<br />처음 만나는 순간
      </h2>

      {/* Grid */}
      <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {series.map((s) => (
          <Link
            key={s.id}
            href={`/guide/${s.id}`}
            className="bg-white border border-border flex flex-col overflow-hidden cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover no-underline text-inherit"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            {/* Top color bar */}
            <div className="h-1.5" style={{ background: s.color }} />

            <div className="p-6 pb-[22px] flex flex-col flex-1">
              {/* Title row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div
                    className="font-archivo font-black text-[30px] leading-none tracking-[-0.02em]"
                    style={{ color: s.color }}
                  >
                    {s.short}
                  </div>
                  <div className="font-archivo font-extrabold text-[17px] uppercase mt-2">
                    {s.name}
                  </div>
                  <div className="text-[13px] text-text-muted mt-0.5">{s.kr}</div>
                </div>
                <span
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] border px-2 py-1 whitespace-nowrap flex-none mt-1"
                  style={{ color: s.color, borderColor: s.color }}
                >
                  {s.tag}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm leading-[1.6] text-text-mid mb-5 flex-1">{s.blurb}</p>

              {/* Facts grid */}
              <div
                className="grid gap-px"
                style={{
                  gridTemplateColumns: '1fr 1fr',
                  background: '#E8E2D5',
                  border: '1px solid #E8E2D5',
                }}
              >
                {s.facts.map(([label, value]) => (
                  <div key={label} className="bg-white px-3 py-2.5">
                    <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
                      {label}
                    </div>
                    <div className="text-[13px] font-bold mt-[3px]">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
