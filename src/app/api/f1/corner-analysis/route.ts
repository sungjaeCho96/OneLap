import { ALGO_VERSION } from '@/features/f1/cornerAnalysis'
import { buildCornerAnalysisData, type CornerAnalysisResponse } from '@/features/f1/cornerAnalysisBuild'
import { getCachedCornerAnalysis, saveCornerAnalysisCache } from '@/lib/db/cornerAnalysisCache'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const sessionKeyRaw = searchParams.get('session_key')

  if (!sessionKeyRaw) {
    const body: CornerAnalysisResponse = { success: false, error: 'session_key 파라미터가 필요합니다.' }
    return Response.json(body, { status: 400 })
  }

  const sessionKey = parseInt(sessionKeyRaw, 10)
  if (isNaN(sessionKey)) {
    const body: CornerAnalysisResponse = { success: false, error: 'session_key는 정수여야 합니다.' }
    return Response.json(body, { status: 400 })
  }

  try {
    const cached = await getCachedCornerAnalysis(sessionKey, ALGO_VERSION)
    if (cached) {
      const body: CornerAnalysisResponse = { success: true, data: cached }
      // no-store: 실제 캐싱은 DB 캐시(algoVersion 키 포함)가 담당한다. 여기서 브라우저
      // Cache-Control까지 걸면 algoVersion을 올려도 브라우저가 예전 응답을 계속 재사용해
      // 코너 탐지 상수를 튜닝할 때마다 혼란을 준다(실제로 겪은 문제).
      return Response.json(body, { headers: { 'Cache-Control': 'no-store' } })
    }

    const data = await buildCornerAnalysisData(sessionKey)

    saveCornerAnalysisCache(data, ALGO_VERSION).catch((err: unknown) => {
      console.error('[corner-analysis] DB 캐시 저장 실패:', err)
    })

    const body: CornerAnalysisResponse = { success: true, data }
    return Response.json(body, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[corner-analysis] 처리 실패:', err)
    const body: CornerAnalysisResponse = {
      success: false,
      error: '코너 분석 데이터를 불러오지 못했습니다.',
    }
    return Response.json(body, { status: 500 })
  }
}
