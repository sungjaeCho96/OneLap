import HomeContent from '@/components/HomeContent'
import Footer from '@/components/Footer'
import { buildSchedule, SERIES, buildNews } from '@/lib/data'
import {
  fetchF1Races,
  fetchAllRaceResults,
  fetchQualifyingSessionList,
  fetchRaceSessionList,
} from '@/features/f1/api'
import type { PitStrategyData } from '@/features/f1/pitStrategy'

// Railway 상시 컨테이너 환경: 파일 캐시(크론 15분 갱신)로 성능 보장,
// ISR 대신 동적 렌더링으로 캐시 업데이트가 즉시 반영되도록
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [f1Races, allResults, sessions, raceSessions] = await Promise.all([
    fetchF1Races(),
    fetchAllRaceResults(),
    fetchQualifyingSessionList(),
    fetchRaceSessionList(),
  ])
  const schedule = buildSchedule(f1Races)
  const news = buildNews()

  // 가장 최근 레이스의 피트 데이터 사전 fetch
  const latestRace = raceSessions.at(-1) ?? null
  let pitInitialData: PitStrategyData | null = null
  if (latestRace) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
      const res = await fetch(
        `${baseUrl}/api/f1/pit-strategy?session_key=${latestRace.sessionKey}`,
        { next: { revalidate: 3600 } },
      )
      const json: { success: boolean; data?: PitStrategyData } = await res.json()
      pitInitialData = json.success ? (json.data ?? null) : null
    } catch {
      pitInitialData = null
    }
  }

  return (
    <div className="min-h-screen bg-bg text-text">
      <HomeContent
        schedule={schedule}
        news={news}
        series={SERIES}
        allResults={allResults}
        sessions={sessions}
        pitRaces={raceSessions}
        pitInitialData={pitInitialData}
      />
      <Footer />
    </div>
  )
}
