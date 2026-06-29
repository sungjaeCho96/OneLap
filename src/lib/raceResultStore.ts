import fs from 'fs/promises'
import path from 'path'
import type { F1RaceResult } from '@/features/f1/api'

const STORE_PATH =
  process.env.RACE_RESULTS_STORE_PATH ??
  path.join(process.cwd(), 'data', 'f1-results-2026.json')

export const DEFAULT_TTL_MS = 6 * 60 * 60 * 1000  // 6시간 (기본)
export const RACE_DAY_TTL_MS = 15 * 60 * 1000     // 15분 (레이스 당일)

interface RaceResultStore {
  updatedAt: string
  ttlMs: number
  results: F1RaceResult[]
}

export async function loadStoredResults(): Promise<{
  results: F1RaceResult[]
  isFresh: boolean
}> {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf-8')
    const store: RaceResultStore = JSON.parse(raw)
    const age = Date.now() - new Date(store.updatedAt).getTime()
    return {
      results: store.results,
      isFresh: age < (store.ttlMs ?? DEFAULT_TTL_MS),
    }
  } catch {
    return { results: [], isFresh: false }
  }
}

export async function saveResults(results: F1RaceResult[], ttlMs = DEFAULT_TTL_MS): Promise<void> {
  try {
    const dir = path.dirname(STORE_PATH)
    await fs.mkdir(dir, { recursive: true })
    const store: RaceResultStore = {
      updatedAt: new Date().toISOString(),
      ttlMs,
      results,
    }
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8')
  } catch {
    console.warn('[raceResultStore] 결과 저장 실패:', STORE_PATH)
  }
}
