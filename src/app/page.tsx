import HomeContent from '@/components/HomeContent'
import Footer from '@/components/Footer'
import { buildSchedule, SERIES, buildNews } from '@/lib/data'
import { fetchF1Races, fetchAllRaceResults, fetchQualifyingSessionList } from '@/features/f1/api'

// Railway 상시 컨테이너 환경: 파일 캐시(크론 15분 갱신)로 성능 보장,
// ISR 대신 동적 렌더링으로 캐시 업데이트가 즉시 반영되도록
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [f1Races, allResults, sessions] = await Promise.all([
    fetchF1Races(),
    fetchAllRaceResults(),
    fetchQualifyingSessionList(),
  ])
  const schedule = buildSchedule(f1Races)
  const news = buildNews()

  return (
    <div className="min-h-screen bg-bg text-text">
      <HomeContent
        schedule={schedule}
        news={news}
        series={SERIES}
        allResults={allResults}
        sessions={sessions}
      />
      <Footer />
    </div>
  )
}
