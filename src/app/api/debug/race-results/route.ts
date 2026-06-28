import { fetchAllRaceResults } from '@/features/f1/api'

export const dynamic = 'force-dynamic'

export async function GET() {
  const steps: Record<string, unknown> = {}

  // 1. OpenF1 기본 연결 확인
  try {
    const res = await fetch('https://api.openf1.org/v1/sessions?session_name=Race&year=2026', { cache: 'no-store' })
    const body = await res.json()
    steps['openf1_sessions'] = {
      status: res.status,
      count: Array.isArray(body) ? body.length : null,
      is_array: Array.isArray(body),
      sample: Array.isArray(body) ? body[0] : body,
    }
  } catch (e) {
    steps['openf1_sessions'] = { error: String(e) }
  }

  // 2. fetchAllRaceResults 전체 실행
  try {
    const results = await fetchAllRaceResults()
    steps['fetchAllRaceResults'] = {
      count: results.length,
      races: results.map((r) => ({ round: r.round, name: r.raceName, resultsCount: r.results.length })),
    }
  } catch (e) {
    steps['fetchAllRaceResults'] = { error: String(e) }
  }

  return Response.json(steps, { headers: { 'Cache-Control': 'no-store' } })
}
