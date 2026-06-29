'use client'

import { useState } from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import ScheduleSection from './ScheduleSection'
import SeriesGuideSection from './SeriesGuideSection'
import NewsSection from './NewsSection'
import RaceResultCard from '@/features/f1/components/RaceResultCard'
import TrackSpeedSection from '@/features/f1/components/TrackSpeedSection'
import { SERIES_MAP } from '@/lib/data'
import type { RaceDisplay, NewsDisplay, Series, SportId } from '@/types'
import type { F1RaceResult } from '@/features/f1/api'
import type { QualifyingSessionOption } from '@/features/f1/trackSpeed'

interface HomeContentProps {
  schedule: RaceDisplay[]
  news: NewsDisplay[]
  series: Series[]
  allResults: F1RaceResult[]
  sessions: QualifyingSessionOption[]
}

export default function HomeContent({ schedule, news, allResults, sessions }: HomeContentProps) {
  const [selectedSport, setSelectedSport] = useState<SportId>('f1')

  const filteredRaces = schedule.filter((r) => r.sport === selectedSport)
  const filteredNews = news.filter((n) => n.sport === selectedSport)
  const selectedSeries = [SERIES_MAP[selectedSport]]

  return (
    <>
      <Navbar selectedSport={selectedSport} onSelectSport={setSelectedSport} />
      <main>
        <HeroSection key={selectedSport} races={filteredRaces} />
        {selectedSport === 'f1' && allResults.length > 0 && <RaceResultCard results={allResults} />}
        {selectedSport === 'f1' && sessions.length > 0 && <TrackSpeedSection sessions={sessions} />}
        <ScheduleSection schedule={filteredRaces} />
        <SeriesGuideSection series={selectedSeries} />
        {filteredNews.length > 0 && <NewsSection news={filteredNews} />}
      </main>
    </>
  )
}
