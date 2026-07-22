import fs from 'fs/promises'
import path from 'path'
import type { F1RaceResult } from '@/features/f1/api'

const STORE_PATH =
  process.env.RACE_RESULTS_STORE_PATH ??
  path.join(process.cwd(), 'data', 'f1-results-2026.json')

export const DEFAULT_CHECK_TTL_MS = 12 * 60 * 60 * 1000  // 12시간
export const RACE_DAY_CHECK_TTL_MS = 30 * 60 * 1000      // 30분 (레이스 당일)

interface RaceResultStore {
  lastCheckedAt: string   // 마지막으로 OpenF1에 조회한 시각
  checkTtlMs: number      // 다음 조회까지 최소 대기 시간
  results: F1RaceResult[] // 누적된 전체 레이스 결과 (영구 저장, 삭제 없음)
}

export async function loadStoredResults(): Promise<{
  results: F1RaceResult[]
  shouldRefresh: boolean
}> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8')
    const store: RaceResultStore = JSON.parse(raw)
    const age = Date.now() - new Date(store.lastCheckedAt).getTime()
    return {
      results: store.results,
      // lastCheckedAt이 없거나 유효하지 않으면 age가 NaN이 되어 항상 false로 새는 것을 방지
      shouldRefresh: Number.isNaN(age) || age >= (store.checkTtlMs ?? DEFAULT_CHECK_TTL_MS),
    }
  } catch {
    return { results: [], shouldRefresh: true }
  }
}

// raceName 기준 upsert — 기존 데이터를 유지하면서 새 결과만 추가/갱신
// round 번호는 OpenF1(완료 세션 개수 기반 idx+1)과 Ergast(공식 캘린더 round)가 서로
// 다르게 계산될 수 있어(예: rate limit로 일부 세션이 누락되면 idx가 밀림) round를 키로 쓰면
// 같은 레이스가 다른 round로 중복 저장된다. raceName은 시즌 내에서 유일하므로 이를 키로 쓴다.
export async function upsertResults(
  newResults: F1RaceResult[],
  checkTtlMs = DEFAULT_CHECK_TTL_MS,
): Promise<void> {
  try {
    const { results: existing } = await loadStoredResults()

    const map = new Map(existing.map((r) => [r.raceName, r]))
    for (const r of newResults) {
      map.set(r.raceName, r)
    }
    const merged = [...map.values()].sort((a, b) => b.round - a.round)

    const dir = path.dirname(STORE_PATH)
    await fs.mkdir(dir, { recursive: true })
    const store: RaceResultStore = {
      lastCheckedAt: new Date().toISOString(),
      checkTtlMs,
      results: merged,
    }
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8')
  } catch {
    console.warn('[raceResultStore] 결과 저장 실패:', STORE_PATH)
  }
}
