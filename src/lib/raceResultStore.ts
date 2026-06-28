import fs from 'fs/promises'
import path from 'path'
import type { F1RaceResult } from '@/features/f1/api'

// 개발: ./data/ (서버 재시작해도 유지), 프로덕션: 환경변수로 오버라이드 가능
const STORE_PATH =
  process.env.RACE_RESULTS_STORE_PATH ??
  path.join(process.cwd(), 'data', 'f1-results-2026.json')

// 저장소가 N분 이내에 업데이트됐으면 신선하다고 판단
const FRESH_TTL_MS = 0 // 항상 재조회 (임시)

interface RaceResultStore {
  updatedAt: string
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
      isFresh: age < FRESH_TTL_MS,
    }
  } catch {
    return { results: [], isFresh: false }
  }
}

export async function saveResults(results: F1RaceResult[]): Promise<void> {
  try {
    const dir = path.dirname(STORE_PATH)
    await fs.mkdir(dir, { recursive: true })
    const store: RaceResultStore = {
      updatedAt: new Date().toISOString(),
      results,
    }
    await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8')
  } catch {
    // 저장 실패는 치명적이지 않음 — 로그만 남기고 진행
    console.warn('[raceResultStore] 결과 저장 실패:', STORE_PATH)
  }
}
