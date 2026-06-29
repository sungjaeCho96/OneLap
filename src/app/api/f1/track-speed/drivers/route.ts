import type { DriverOption } from '@/features/f1/trackSpeed'

export const revalidate = 86400

interface OpenF1DriverEntry {
  driver_number: number
  name_acronym: string
  first_name: string
  last_name: string
  team_name: string
  team_colour: string
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const sessionKeyRaw = searchParams.get('session_key')

  if (!sessionKeyRaw) {
    return Response.json({ success: false, error: 'session_key 파라미터가 필요합니다.' }, { status: 400 })
  }

  const sessionKey = parseInt(sessionKeyRaw, 10)
  if (isNaN(sessionKey)) {
    return Response.json({ success: false, error: 'session_key는 정수여야 합니다.' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://api.openf1.org/v1/drivers?session_key=${sessionKey}`,
      { next: { revalidate: 86400 } },
    )
    if (!res.ok) throw new Error('OpenF1 drivers error')

    const raw: OpenF1DriverEntry[] = await res.json()
    if (!Array.isArray(raw)) throw new Error('Invalid drivers data')

    const drivers: DriverOption[] = raw.map((d) => ({
      driverNumber: d.driver_number,
      code: d.name_acronym,
      fullName: `${d.first_name} ${d.last_name}`,
      teamName: d.team_name,
      teamColour: '#' + d.team_colour,
    }))

    return Response.json(
      { success: true, drivers },
      { headers: { 'Cache-Control': 'public, max-age=86400' } },
    )
  } catch (err) {
    console.error('[track-speed/drivers] failed:', err)
    return Response.json({ success: false, error: '드라이버 목록을 불러오지 못했습니다.' }, { status: 500 })
  }
}
