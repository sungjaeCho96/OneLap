import cron from 'node-cron'
import { loadStoredResults, DEFAULT_TTL_MS, RACE_DAY_TTL_MS } from '@/lib/raceResultStore'

let initialized = false

function isRaceOngoing(raceStartIso: string): boolean {
  const start = new Date(raceStartIso).getTime()
  const now = Date.now()
  return now >= start && now <= start + 3 * 60 * 60 * 1000 // 결승 시작 후 3시간 이내
}

async function runRefresh() {
  const { fetchF1Races, refreshAllRaceResults } = await import('@/features/f1/api')
  try {
    const races = await fetchF1Races()
    const ongoing = races.some((r) => isRaceOngoing(r.date))

    if (!ongoing) {
      // 레이스 당일이 아닐 때는 12시간 TTL이 남아있으면 스킵
      const { isFresh } = await loadStoredResults()
      if (isFresh) {
        console.info('[cron] 캐시 신선, 갱신 스킵')
        return
      }
    }

    const ttlMs = ongoing ? RACE_DAY_TTL_MS : DEFAULT_TTL_MS
    await refreshAllRaceResults(ttlMs)
    const label = ongoing ? '레이스 당일 30분' : '기본 12시간'
    console.info(`[cron] 경기 결과 갱신 완료 (TTL: ${label})`)
  } catch (err) {
    console.error('[cron] 경기 결과 갱신 실패:', err)
  }
}

export function setupCron() {
  if (initialized) return
  initialized = true

  // 30분마다 실행 — 레이스 당일은 매 실행마다 갱신, 평상시는 12시간 TTL 체크 후 갱신
  cron.schedule('*/30 * * * *', runRefresh)
  console.info('[cron] 경기 결과 갱신 크론 등록 (매 30분, 레이스 당일 30분 / 평상시 12시간)')

  // 서버 시작 시 즉시 한 번 실행
  runRefresh().catch(() => null)
}
