import HomeContent from '@/components/HomeContent'
import Footer from '@/components/Footer'
import { buildSchedule, SERIES, buildNews } from '@/lib/data'
import { fetchF1Races, fetchLatestRaceResult } from '@/features/f1/api'

export const revalidate = 3600

export default async function HomePage() {
  const [f1Races, latestResult] = await Promise.all([
    fetchF1Races(),
    fetchLatestRaceResult(),
  ])
  const schedule = buildSchedule(f1Races)
  const news = buildNews()

  return (
    <div className="min-h-screen bg-bg text-text">
      <HomeContent
        schedule={schedule}
        news={news}
        series={SERIES}
        latestResult={latestResult}
      />
      <Footer />
    </div>
  )
}
