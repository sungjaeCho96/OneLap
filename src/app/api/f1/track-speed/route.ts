import { buildTrackSpeedData } from '@/features/f1/trackSpeed'
import type { TrackSpeedResponse } from '@/features/f1/trackSpeed'
import { getCachedTrackSpeed, saveTrackSpeedCache } from '@/lib/db/trackSpeedCache'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)

  const sessionKeyRaw = searchParams.get('session_key')
  const driversRaw = searchParams.get('drivers')

  if (!sessionKeyRaw || !driversRaw) {
    const body: TrackSpeedResponse = { success: false, error: 'session_key와 drivers 파라미터가 필요합니다.' }
    return Response.json(body, { status: 400 })
  }

  const sessionKey = parseInt(sessionKeyRaw, 10)
  if (isNaN(sessionKey)) {
    const body: TrackSpeedResponse = { success: false, error: 'session_key는 정수여야 합니다.' }
    return Response.json(body, { status: 400 })
  }

  const driverParts = driversRaw.split(',').map((s) => parseInt(s.trim(), 10))
  if (driverParts.length !== 2 || driverParts.some(isNaN)) {
    const body: TrackSpeedResponse = { success: false, error: 'drivers는 쉼표로 구분된 정수 2개여야 합니다.' }
    return Response.json(body, { status: 400 })
  }

  const driverNumbers: [number, number] = [driverParts[0], driverParts[1]]

  try {
    const cached = await getCachedTrackSpeed(sessionKey, driverNumbers)
    if (cached) {
      const body: TrackSpeedResponse = { success: true, data: cached }
      return Response.json(body, {
        headers: { 'Cache-Control': 'public, max-age=86400', 'X-Cache': 'HIT' },
      })
    }

    const data = await buildTrackSpeedData(sessionKey, driverNumbers)

    // 저장 실패가 응답을 막으면 안 되므로 비동기로 처리
    saveTrackSpeedCache(data).catch((err) =>
      console.error('[track-speed] DB 저장 실패:', err),
    )

    const body: TrackSpeedResponse = { success: true, data }
    return Response.json(body, {
      headers: { 'Cache-Control': 'public, max-age=86400', 'X-Cache': 'MISS' },
    })
  } catch (err) {
    console.error('[track-speed] 처리 실패:', err)
    const body: TrackSpeedResponse = { success: false, error: '트랙 데이터를 불러오지 못했습니다.' }
    return Response.json(body, { status: 500 })
  }
}
