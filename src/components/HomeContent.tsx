'use client'

import { useState } from 'react'
import Navbar from './Navbar'
import HeroSection from './HeroSection'
import ScheduleSection from './ScheduleSection'
import SeriesGuideSection from './SeriesGuideSection'
import NewsSection from './NewsSection'
import RaceResultCard from '@/features/f1/components/RaceResultCard'
import TrackSpeedSection from '@/features/f1/components/TrackSpeedSection'
import PitStrategySection from '@/features/f1/components/PitStrategySection'
import AnalysisSection from '@/features/f1/components/analysis/AnalysisSection'
import type { AnalysisTabItem } from '@/features/f1/components/analysis/types'
import { SERIES_MAP } from '@/lib/data'
import type { RaceDisplay, NewsDisplay, Series, SportId } from '@/types'
import type { F1RaceResult } from '@/features/f1/api'
import type { QualifyingSessionOption } from '@/features/f1/trackSpeed'
import type { RaceSession, PitStrategyData } from '@/features/f1/pitStrategy'

interface HomeContentProps {
  schedule: RaceDisplay[]
  news: NewsDisplay[]
  series: Series[]
  allResults: F1RaceResult[]
  sessions: QualifyingSessionOption[]
  pitRaces: readonly RaceSession[]
  pitInitialData: PitStrategyData | null
}

export default function HomeContent({
  schedule,
  news,
  allResults,
  sessions,
  pitRaces,
  pitInitialData,
}: HomeContentProps) {
  const [selectedSport, setSelectedSport] = useState<SportId>('f1')

  const filteredRaces = schedule.filter((r) => r.sport === selectedSport)
  const filteredNews = news.filter((n) => n.sport === selectedSport)
  const selectedSeries = [SERIES_MAP[selectedSport]]

  const analysisTabs: AnalysisTabItem[] = [
    sessions.length > 0 && {
      id: 'track-speed',
      label: '트랙 속도 비교',
      eyebrow: 'QUALIFYING',
      content: <TrackSpeedSection sessions={sessions} />,
    },
    pitRaces.length > 0 && {
      id: 'pit-strategy',
      label: '피트스톱 전략',
      eyebrow: 'PIT STRATEGY',
      content: <PitStrategySection races={pitRaces} initialData={pitInitialData} />,
    },
  ].filter(Boolean) as AnalysisTabItem[]

  return (
    <>
      <Navbar selectedSport={selectedSport} onSelectSport={setSelectedSport} />
      <main>
        <HeroSection key={selectedSport} races={filteredRaces} />
        {selectedSport === 'f1' && allResults.length > 0 && <RaceResultCard results={allResults} />}
        {selectedSport === 'f1' && (
          <AnalysisSection key={selectedSport} tabs={analysisTabs} />
        )}
        <ScheduleSection schedule={filteredRaces} />
        <SeriesGuideSection series={selectedSeries} />
        {filteredNews.length > 0 && <NewsSection news={filteredNews} />}
      </main>
    </>
  )
}
