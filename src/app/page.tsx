import HomeContent from '@/components/HomeContent'
import Footer from '@/components/Footer'
import { buildSchedule, SERIES, buildNews } from '@/lib/data'
import { fetchF1Races, fetchAllRaceResults } from '@/features/f1/api'

export const revalidate = 3600

export default async function HomePage() {
  const [f1Races, allResults] = await Promise.all([
    fetchF1Races(),
    fetchAllRaceResults(),
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
      />
      <Footer />
    </div>
  )
}
