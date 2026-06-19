import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-bg-dark text-[#C9C1B2] px-6 pt-14 pb-10">
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-wrap justify-between gap-8 border-b border-border-dark pb-9 mb-6">
          {/* Brand */}
          <div className="max-w-[360px]">
            <div className="flex items-center gap-3 mb-4">
              <Logo variant="dark" size={40} />
              <div className="font-archivo font-black text-[22px] text-text-inv tracking-[-0.02em]">
                OneLap
              </div>
            </div>
            <p className="text-sm leading-[1.6] text-text-dim">
              모두가 하나 되는, 한 바퀴. 모터스포츠를 처음 만나는 순간부터, 함께 달리는 모든 순간까지.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 flex-wrap">
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-muted mb-3.5">
                탐색
              </div>
              <div className="flex flex-col gap-2.5 text-sm">
                <a href="#schedule" className="text-[#C9C1B2] no-underline hover:text-text-inv transition-colors">경기 일정</a>
                <a href="#series" className="text-[#C9C1B2] no-underline hover:text-text-inv transition-colors">시작하기</a>
                <a href="#news" className="text-[#C9C1B2] no-underline hover:text-text-inv transition-colors">뉴스</a>
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-muted mb-3.5">
                종목
              </div>
              <div className="flex flex-col gap-2.5 text-sm text-[#C9C1B2]">
                <span>Formula 1</span>
                <span>FIA WEC</span>
                <span>World Rally</span>
                <span>슈퍼레이스</span>
                <span>현대 N</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-wrap justify-between gap-3 font-mono text-[11px] text-[#6E655A] tracking-[0.04em]">
          <span>© 2026 OneLap. 모터스포츠 정보 통합 사이트.</span>
          <span>모든 데이터는 예시입니다.</span>
        </div>
      </div>
    </footer>
  )
}
