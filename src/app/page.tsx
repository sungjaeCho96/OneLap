import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import ScheduleSection from '@/components/ScheduleSection'
import SeriesGuideSection from '@/components/SeriesGuideSection'
import NewsSection from '@/components/NewsSection'
import Footer from '@/components/Footer'
import { buildSchedule, SERIES, buildNews } from '@/lib/data'
import { fetchF1Races } from '@/lib/f1Api'

export const revalidate = 3600

export default async function HomePage() {
  const f1Races = await fetchF1Races()
  const schedule = buildSchedule(f1Races)
  const nextRace = schedule[0]
  const news = buildNews()

  return (
    <div className="min-h-screen bg-bg text-text">
      <Navbar />
      <main>
        <HeroSection nextRace={nextRace} />
        <ScheduleSection schedule={schedule} />
        <SeriesGuideSection series={SERIES} />
        <NewsSection news={news} />
      </main>
      <Footer />
    </div>
  )
}
