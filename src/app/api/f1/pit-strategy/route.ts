import type {
  PitStrategyData,
  PitStrategyResponse,
  TyreCompound,
  Stint,
  DriverStrategy,
  RaceStatus,
} from '@/features/f1/pitStrategy'
import { getCachedPitStrategy, savePitStrategyCache } from '@/lib/db/pitStrategyCache'
import { detectPitDuels, buildSafetyCarPeriods } from '@/features/f1/pitDuels'

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
  date: string
}

interface OpenF1Position {
  date: string
  driver_number: number
  position: number
}

interface OpenF1Interval {
  date: string
  driver_number: number
  interval: number | null
}

interface OpenF1RaceControl {
  date: string
  category: string
  message: string | null
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

interface OpenF1ResultEntry {
  driver_number: number
  position: number | null
  number_of_laps: number
  dnf: boolean
  dns: boolean
  dsq: boolean
}

// 429(rate limit)·5xx(일시 장애) 재시도 — trackSpeed의 fetchOF1과 동일 패턴
async function fetchWithRetry(url: string, attempt = 0): Promise<Response> {
  const res = await fetch(url, { next: { revalidate: 3600 } } as const)
  if (res.status === 429 && attempt < 2) {
    await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)))
    return fetchWithRetry(url, attempt + 1)
  }
  if (res.status >= 500 && attempt < 2) {
    await new Promise((r) => setTimeout(r, 500 * (attempt + 1)))
    return fetchWithRetry(url, attempt + 1)
  }
  return res
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
      // 구버전 캐시(듀얼 필드 추가 이전)에 대한 안전한 기본값
      const data: PitStrategyData = { ...cached, duels: cached.duels ?? [] }
      const body: PitStrategyResponse = { success: true, data }
      return Response.json(body, { headers: { 'Cache-Control': 'public, max-age=3600' } })
    }

    // 동시 요청 시 OpenF1 rate limit(429) 유발 — 순차 실행
    const base = `https://api.openf1.org/v1`
    const stintsRes = await fetchWithRetry(`${base}/stints?session_key=${sessionKey}`)
    const pitsRes = await fetchWithRetry(`${base}/pit?session_key=${sessionKey}`)
    const driversRes = await fetchWithRetry(`${base}/drivers?session_key=${sessionKey}`)
    const sessionRes = await fetchWithRetry(`${base}/sessions?session_key=${sessionKey}`)
    const resultRes = await fetchWithRetry(`${base}/session_result?session_key=${sessionKey}`)
    // 언더컷/오버컷 듀얼 판정용 — 실패해도 스틴트 차트는 정상 동작해야 하므로 소프트 폴백
    const positionRes = await fetchWithRetry(`${base}/position?session_key=${sessionKey}`)
    const intervalsRes = await fetchWithRetry(`${base}/intervals?session_key=${sessionKey}`)
    const raceControlRes = await fetchWithRetry(`${base}/race_control?session_key=${sessionKey}`)

    if (!stintsRes.ok || !pitsRes.ok || !driversRes.ok) {
      throw new Error(`OpenF1 fetch failed — stints:${stintsRes.status} pit:${pitsRes.status} drivers:${driversRes.status}`)
    }

    const rawStints: OpenF1Stint[] = await stintsRes.json()
    const rawPits: OpenF1Pit[] = await pitsRes.json()
    const rawDrivers: OpenF1Driver[] = await driversRes.json()
    const sessionMetas: OpenF1SessionMeta[] = sessionRes.ok ? await sessionRes.json() : []
    const rawResults: OpenF1ResultEntry[] = resultRes.ok ? await resultRes.json() : []
    const rawPositions: OpenF1Position[] = positionRes.ok ? await positionRes.json() : []
    const rawIntervals: OpenF1Interval[] = intervalsRes.ok ? await intervalsRes.json() : []
    const rawRaceControl: OpenF1RaceControl[] = raceControlRes.ok ? await raceControlRes.json() : []

    if (!Array.isArray(rawStints) || !Array.isArray(rawPits) || !Array.isArray(rawDrivers)) {
      throw new Error('Invalid data format from OpenF1')
    }

    const meta = Array.isArray(sessionMetas) && sessionMetas.length > 0 ? sessionMetas[0] : null

    // 공식 DNF/DNS/DSQ 판정 — race-results와 동일하게 session_result를 신뢰 소스로 사용.
    // (마지막 스틴트의 lap_end를 totalLaps와 비교하는 방식은 랩 다운된 정상 완주자를
    //  DNF로 오판하는 문제가 있어 폐기)
    const resultMap = new Map<
      number,
      { position: number | null; numberOfLaps: number; dnf: boolean; dns: boolean; dsq: boolean }
    >(
      Array.isArray(rawResults)
        ? rawResults.map((r) => [
            r.driver_number,
            { position: r.position, numberOfLaps: r.number_of_laps, dnf: r.dnf, dns: r.dns, dsq: r.dsq },
          ])
        : [],
    )

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
    // 정렬 기준(등수)을 함께 들고 있다가 최종 정렬 후 버림
    const drivers: Array<{ strategy: DriverStrategy; position: number | null; numberOfLaps: number }> = []
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

      const maxLapEnd = Math.max(...sortedStints.map((s) => s.lap_end))
      const result = resultMap.get(driverNumber)
      const raceStatus: RaceStatus = result
        ? result.dsq
          ? 'DSQ'
          : result.dns
            ? 'DNS'
            : result.dnf
              ? 'DNF'
              : null
        : maxLapEnd < totalLaps - 1
          ? 'DNF'
          : null

      drivers.push({
        strategy: {
          driverNumber,
          nameAcronym: info.nameAcronym,
          teamName: info.teamName,
          teamColour: info.teamColour,
          stints: mappedStints,
          pitCount: mappedStints.length - 1,
          totalLaps,
          raceStatus,
        },
        position: result?.position ?? null,
        numberOfLaps: result?.numberOfLaps ?? maxLapEnd,
      })
    }

    // 완주자는 등수(1~22등) 오름차순, 리타이어한 드라이버는 완주 랩 수 내림차순으로 뒤에 붙임
    // (race-results 화면의 buildDriverResults와 동일한 정렬 규칙)
    const finishers = drivers
      .filter((d) => d.position != null)
      .sort((a, b) => (a.position as number) - (b.position as number))
    const nonFinishers = drivers
      .filter((d) => d.position == null)
      .sort((a, b) => b.numberOfLaps - a.numberOfLaps)
    const sortedDrivers = [...finishers, ...nonFinishers].map((d) => d.strategy)

    const duels = Array.isArray(rawPositions) && Array.isArray(rawIntervals)
      ? detectPitDuels({
          pitEvents: rawPits.map((p) => ({
            driverNumber: p.driver_number,
            lapNumber: p.lap_number,
            dateMs: new Date(p.date).getTime(),
          })),
          positionSamples: rawPositions.map((p) => ({
            driverNumber: p.driver_number,
            dateMs: new Date(p.date).getTime(),
            position: p.position,
          })),
          intervalSamples: rawIntervals.map((i) => ({
            driverNumber: i.driver_number,
            dateMs: new Date(i.date).getTime(),
            interval: i.interval,
          })),
          finalPositions: new Map(
            [...resultMap.entries()].map(([driverNumber, r]) => [driverNumber, r.position]),
          ),
          safetyCarPeriods: Array.isArray(rawRaceControl)
            ? buildSafetyCarPeriods(
                rawRaceControl.map((r) => ({
                  dateMs: new Date(r.date).getTime(),
                  category: r.category,
                  message: r.message ?? '',
                })),
              )
            : [],
        })
      : []

    const data: PitStrategyData = {
      sessionKey,
      circuitShortName: meta?.circuit_short_name ?? 'Unknown',
      countryName: meta?.country_name ?? 'Unknown',
      totalLaps,
      drivers: sortedDrivers,
      duels,
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
