import type {
  PitStrategyData,
  PitStrategyResponse,
  TyreCompound,
  Stint,
  DriverStrategy,
} from '@/features/f1/pitStrategy'
import { getCachedPitStrategy, savePitStrategyCache } from '@/lib/db/pitStrategyCache'

interface OpenF1Stint {
  session_key: number
  meeting_key: number
  driver_number: number
  stint_number: number
  compound: string
  lap_start: number
  lap_end: number
  tyre_age_at_start: number
}

interface OpenF1Pit {
  session_key: number
  meeting_key: number
  driver_number: number
  lap_number: number
  pit_duration: number
}

interface OpenF1Driver {
  driver_number: number
  name_acronym: string
  team_name: string
  team_colour: string
}

interface OpenF1SessionMeta {
  circuit_short_name: string
  country_name: string
}

function normalizeColour(colour: string): string {
  return colour.startsWith('#') ? colour : '#' + colour
}

function normalizeCompound(raw: string): TyreCompound {
  const upper = raw.toUpperCase()
  if (
    upper === 'SOFT' ||
    upper === 'MEDIUM' ||
    upper === 'HARD' ||
    upper === 'INTERMEDIATE' ||
    upper === 'WET'
  ) {
    return upper
  }
  return 'UNKNOWN'
}

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const sessionKeyRaw = searchParams.get('session_key')

  if (!sessionKeyRaw) {
    const body: PitStrategyResponse = { success: false, error: 'session_key 파라미터가 필요합니다.' }
    return Response.json(body, { status: 400 })
  }

  const sessionKey = parseInt(sessionKeyRaw, 10)
  if (isNaN(sessionKey)) {
    const body: PitStrategyResponse = { success: false, error: 'session_key는 정수여야 합니다.' }
    return Response.json(body, { status: 400 })
  }

  try {
    const cached = await getCachedPitStrategy(sessionKey)
    if (cached) {
      const body: PitStrategyResponse = { success: true, data: cached }
      return Response.json(body, { headers: { 'Cache-Control': 'public, max-age=3600' } })
    }

    const fetchOpts = { next: { revalidate: 3600 } } as const

    // 3 parallel fetches: stints, pit stops, drivers + session meta
    const [stintsRes, pitsRes, driversRes, sessionRes] = await Promise.all([
      fetch(`https://api.openf1.org/v1/stints?session_key=${sessionKey}`, fetchOpts),
      fetch(`https://api.openf1.org/v1/pit?session_key=${sessionKey}`, fetchOpts),
      fetch(`https://api.openf1.org/v1/drivers?session_key=${sessionKey}`, fetchOpts),
      fetch(`https://api.openf1.org/v1/sessions?session_key=${sessionKey}`, fetchOpts),
    ])

    if (!stintsRes.ok || !pitsRes.ok || !driversRes.ok) {
      throw new Error('OpenF1 fetch failed')
    }

    const [rawStints, rawPits, rawDrivers, sessionMetas]: [
      OpenF1Stint[],
      OpenF1Pit[],
      OpenF1Driver[],
      OpenF1SessionMeta[],
    ] = await Promise.all([
      stintsRes.json(),
      pitsRes.json(),
      driversRes.json(),
      sessionRes.ok ? sessionRes.json() : Promise.resolve([]),
    ])

    if (!Array.isArray(rawStints) || !Array.isArray(rawPits) || !Array.isArray(rawDrivers)) {
      throw new Error('Invalid data format from OpenF1')
    }

    const meta = Array.isArray(sessionMetas) && sessionMetas.length > 0 ? sessionMetas[0] : null

    // driverMap: driverNumber → driver info (normalise teamColour '#' prefix)
    const driverMap = new Map<
      number,
      { nameAcronym: string; teamName: string; teamColour: string }
    >(
      rawDrivers.map((d) => [
        d.driver_number,
        {
          nameAcronym: d.name_acronym,
          teamName: d.team_name,
          teamColour: normalizeColour(d.team_colour),
        },
      ]),
    )

    // pitMap: driverNumber → Map<lapNumber, pitDuration>
    const pitMap = new Map<number, Map<number, number>>()
    for (const pit of rawPits) {
      if (!pitMap.has(pit.driver_number)) {
        pitMap.set(pit.driver_number, new Map())
      }
      pitMap.get(pit.driver_number)!.set(pit.lap_number, pit.pit_duration)
    }

    // Group stints by driverNumber
    const stintsByDriver = new Map<number, OpenF1Stint[]>()
    for (const stint of rawStints) {
      if (!stintsByDriver.has(stint.driver_number)) {
        stintsByDriver.set(stint.driver_number, [])
      }
      stintsByDriver.get(stint.driver_number)!.push(stint)
    }

    // Compute totalLaps = max lapEnd across all drivers
    let totalLaps = 0
    for (const stints of stintsByDriver.values()) {
      for (const s of stints) {
        if (s.lap_end > totalLaps) totalLaps = s.lap_end
      }
    }

    // Build DriverStrategy[] — immutable transforms, no in-place mutation
    const drivers: DriverStrategy[] = []
    for (const [driverNumber, stints] of stintsByDriver.entries()) {
      if (stints.length === 0) continue

      const info = driverMap.get(driverNumber)
      if (!info) continue

      const sortedStints = [...stints].sort((a, b) => a.stint_number - b.stint_number)
      const driverPitMap = pitMap.get(driverNumber) ?? new Map<number, number>()

      const mappedStints: Stint[] = sortedStints.map((s, i) => {
        const lapCount = s.lap_end - s.lap_start + 1
        const compound = normalizeCompound(s.compound)
        // pitDuration: for stints after the first, look up lapStart in pit map
        const pitDuration = i > 0 ? (driverPitMap.get(s.lap_start) ?? null) : null

        return {
          stintNumber: s.stint_number,
          compound,
          lapStart: s.lap_start,
          lapEnd: s.lap_end,
          lapCount,
          tyreAgeAtStart: s.tyre_age_at_start,
          pitDuration,
        }
      })

      const driverMaxLap = Math.max(...sortedStints.map((s) => s.lap_end))
      const isDnf = driverMaxLap < totalLaps - 1

      drivers.push({
        driverNumber,
        nameAcronym: info.nameAcronym,
        teamName: info.teamName,
        teamColour: info.teamColour,
        stints: mappedStints,
        pitCount: mappedStints.length - 1,
        totalLaps,
        isDnf,
      })
    }

    // Sort by driver_number ascending (new array, no mutation)
    const sortedDrivers = [...drivers].sort((a, b) => a.driverNumber - b.driverNumber)

    const data: PitStrategyData = {
      sessionKey,
      circuitShortName: meta?.circuit_short_name ?? 'Unknown',
      countryName: meta?.country_name ?? 'Unknown',
      totalLaps,
      drivers: sortedDrivers,
    }

    savePitStrategyCache(data).catch((err: unknown) => {
      console.error('[pit-strategy] DB 캐시 저장 실패:', err)
    })

    const body: PitStrategyResponse = { success: true, data }
    return Response.json(body, {
      headers: { 'Cache-Control': 'public, max-age=3600' },
    })
  } catch (err) {
    console.error('[pit-strategy] 처리 실패:', err)
    const body: PitStrategyResponse = {
      success: false,
      error: '피트 스톱 데이터를 불러오지 못했습니다.',
    }
    return Response.json(body, { status: 500 })
  }
}
