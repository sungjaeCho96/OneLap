import cron from 'node-cron'
import { RACE_DAY_TTL_MS, DEFAULT_TTL_MS } from '@/lib/raceResultStore'

let initialized = false

function isRaceOngoing(raceStartIso: string): boolean {
  const start = new Date(raceStartIso).getTime()
  const now = Date.now()
  return now >= start && now <= start + 3 * 60 * 60 * 1000 // 레이스 시작 후 3시간 이내
}

async function runRefresh() {
  const { fetchF1Races, refreshAllRaceResults } = await import('@/features/f1/api')
  try {
    const races = await fetchF1Races()
    const ongoing = races.some((r) => isRaceOngoing(r.date))
    const ttlMs = ongoing ? RACE_DAY_TTL_MS : DEFAULT_TTL_MS

    await refreshAllRaceResults(ttlMs)
    const label = ongoing ? '레이스 당일 15분' : '기본 6시간'
    console.info(`[cron] 경기 결과 갱신 완료 (TTL: ${label})`)
  } catch (err) {
    console.error('[cron] 경기 결과 갱신 실패:', err)
  }
}

export function setupCron() {
  if (initialized) return
  initialized = true

  // 15분마다 실행
  cron.schedule('*/15 * * * *', runRefresh)
  console.info('[cron] 경기 결과 갱신 크론 등록 (매 15분)')

  // 앱 시작 시 즉시 한 번 실행 (스토어가 비어있을 때 빠른 초기화)
  runRefresh().catch(() => null)
}
