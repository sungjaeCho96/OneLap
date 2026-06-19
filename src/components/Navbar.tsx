import Logo from './Logo'

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-border"
      style={{ background: 'rgba(242,239,232,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-6 px-6 py-4">
        <div className="flex items-center gap-3.5">
          <Logo variant="light" size={40} />
          <div>
            <div className="font-archivo font-black text-2xl leading-none tracking-tight text-text">
              OneLap
            </div>
            <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-text-muted mt-0.5">
              모터스포츠
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-7 font-noto text-sm font-bold">
          <a href="#schedule" className="text-text hover:text-text-muted transition-colors">
            경기 일정
          </a>
          <a href="#series" className="text-text hover:text-text-muted transition-colors">
            시작하기
          </a>
          <a href="#news" className="text-text hover:text-text-muted transition-colors">
            뉴스
          </a>
          <a
            href="#schedule"
            className="font-mono text-xs font-bold uppercase tracking-[0.08em] bg-text text-text-inv px-[18px] py-[9px] rounded-sm hover:opacity-80 transition-opacity"
          >
            LIVE
          </a>
        </nav>
      </div>
    </header>
  )
}
