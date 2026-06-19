import type { NewsDisplay } from '@/types'

interface NewsSectionProps {
  news: NewsDisplay[]
}

export default function NewsSection({ news }: NewsSectionProps) {
  return (
    <section
      id="news"
      className="py-[72px] border-t border-border"
      style={{ background: '#EAE5DA' }}
    >
      <div className="mx-auto max-w-[1280px] px-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-9">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.18em] text-text-muted mb-3">
              Stories
            </div>
            <h2
              className="font-archivo font-black uppercase leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(34px, 5vw, 60px)' }}
            >
              트랙 위의<br />이야기들
            </h2>
          </div>
          <a
            href="#news"
            className="font-mono text-xs font-bold uppercase tracking-[0.06em] text-text no-underline border-b-2 border-text pb-1 hover:opacity-70 transition-opacity"
          >
            전체 보기 →
          </a>
        </div>

        {/* News grid */}
        <div
          className="grid gap-5"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}
        >
          {news.map((n, i) => (
            <a
              key={i}
              href="#news"
              className="bg-white border border-border flex flex-col no-underline text-text overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
              style={n.big ? { gridColumn: 'span 2' } : {}}
            >
              {/* Image placeholder */}
              <div
                className="relative border-b border-border flex items-center justify-center"
                style={{
                  aspectRatio: '16/9',
                  background:
                    'repeating-linear-gradient(48deg,#E4DFD3 0,#E4DFD3 10px,#ECE7DC 10px,#ECE7DC 20px)',
                }}
              >
                <span
                  className="absolute top-3.5 left-3.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-white px-[9px] py-1 rounded-sm"
                  style={{ background: n.color }}
                >
                  {n.sportShort} · {n.tag}
                </span>
                <span className="font-mono text-[11px] text-text-dim tracking-[0.1em]">
                  [ 뉴스 사진 ]
                </span>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3
                  className="font-archivo font-extrabold leading-[1.18] tracking-[-0.01em] mb-2.5"
                  style={{ fontSize: 'clamp(18px, 2vw, 22px)' }}
                >
                  {n.title}
                </h3>
                <p className="text-sm leading-[1.55] text-text-mid mb-4 flex-1">{n.excerpt}</p>
                <div className="flex items-center gap-2.5 font-mono text-[11px] text-text-muted border-t border-[#EFEADF] pt-3">
                  <span className="text-text font-bold">{n.author}</span>
                  <span>·</span>
                  <span>{n.read}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
