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
      return Response.json(body, { headers: { 'Cache-Control': 'public, max-age=86400' } })
    }

    const data = await buildCornerAnalysisData(sessionKey)

    saveCornerAnalysisCache(data, ALGO_VERSION).catch((err: unknown) => {
      console.error('[corner-analysis] DB 캐시 저장 실패:', err)
    })

    const body: CornerAnalysisResponse = { success: true, data }
    return Response.json(body, {
      headers: { 'Cache-Control': 'public, max-age=86400' },
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
