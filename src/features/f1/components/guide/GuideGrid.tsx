import { SecHead } from './primitives'
import TeamShowcase from '../TeamShowcase'
import DriverGallery from '../DriverGallery'

export default function GuideGrid() {
  return (
    <>
      {/* 02-B. 2026 그리드 — 11개 팀 */}
      <section className="pt-16 pb-[72px] border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <SecHead
            num="02-B"
            title="2026 그리드 — 11개 팀 둘러보기"
            sub="로고를 눌러 각 팀의 드라이버와 특징, 초심자 관전 포인트를 확인하세요. 응원할 팀을 하나 정하면 레이스가 훨씬 재밌어집니다."
          />
          <TeamShowcase />
        </div>
      </section>

      {/* 02-C. 드라이버 라인업 */}
      <section className="pb-[72px] border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="pt-16 mb-1">
            <SecHead
              num="02-C"
              title="2026 드라이버 라인업"
              sub="11개 팀, 22명의 드라이버. 팀마다 두 명씩 — 같은 차를 타는 팀메이트가 서로의 가장 가까운 라이벌이기도 합니다."
            />
          </div>
          <DriverGallery />
        </div>
      </section>
    </>
  )
}
