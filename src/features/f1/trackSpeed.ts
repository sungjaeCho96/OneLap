// ─── Public types ────────────────────────────────────────────────────────────

export interface QualifyingSessionOption {
  sessionKey: number
  circuitShortName: string
  countryName: string
  dateStart: string
  round: number
}

export interface DriverOption {
  driverNumber: number
  code: string
  fullName: string
  teamName: string
  teamColour: string
}

export interface TrackPoint {
  x: number
  y: number
  speed: number
  throttle: number
  brake: number
  gear: number
  d: number // cumulative distance ratio 0..1
}

export interface DriverLapTrace {
  driverNumber: number
  code: string
  teamColour: string
  lapNumber: number
  lapDuration: number
  points: TrackPoint[]
}

export interface TrackSpeedBounds {
  viewBox: number
  speedMin: number
  speedMax: number
}

export interface TrackSpeedData {
  sessionKey: number
  circuitShortName: string
  bounds: TrackSpeedBounds
  drivers: [DriverLapTrace, DriverLapTrace]
}

export type TrackSpeedResponse =
  | { success: true; data: TrackSpeedData }
  | { success: false; error: string }

/** points 배열에서 d값이 가장 가까운 TrackPoint를 반환 */
export function findClosestByD(points: TrackPoint[], d: number): TrackPoint {
  return points.reduce((best, p) =>
    Math.abs(p.d - d) < Math.abs(best.d - d) ? p : best,
  )
}

// ─── OpenF1 internal types ────────────────────────────────────────────────────

interface OpenF1Lap {
  driver_number: number
  lap_number: number
  lap_duration: number | null
  date_start: string | null
  is_pit_out_lap: boolean
}

interface OpenF1Location {
  date: string
  driver_number: number
  x: number
  y: number
}

interface OpenF1CarData {
  date: string
  driver_number: number
  speed: number
  throttle: number
  brake: number
  n_gear: number
}

interface OpenF1Driver {
  driver_number: number
  name_acronym: string
  first_name: string
  last_name: string
  team_name: string
  team_colour: string
}

interface OpenF1SessionMeta {
  session_key: number
  circuit_short_name: string
  country_name: string
}

// ─── Internal pipeline types ──────────────────────────────────────────────────

interface RawPoint {
  x: number
  y: number
  speed: number
  throttle: number
  brake: number
  gear: number
}

interface DriverRawTrace {
  raw: RawPoint[]
  code: string
  teamColour: string
  lapNumber: number
  lapDuration: number
}

// ─── Fetch with retry ────────────────────────────────────────────────────────

const OF1_FETCH_OPTS = { next: { revalidate: 86400 } } as const

async function fetchOF1(url: string, attempt = 0): Promise<Response> {
  const res = await fetch(url, OF1_FETCH_OPTS)
  // 429 Rate Limit: 1회 재시도 (1s 대기)
  if (res.status === 429 && attempt < 1) {
    await new Promise((r) => setTimeout(r, 1000))
    return fetchOF1(url, attempt + 1)
  }
  return res
}

// ─── URL builder ─────────────────────────────────────────────────────────────

function openF1Url(endpoint: string, params: Record<string, string>): string {
  const base = `https://api.openf1.org/v1/${endpoint}`
  const qs = Object.entries(params)
    .map(([k, v]) => {
      // date>= / date<= 비교 연산자: > < 를 %3E %3C 로 미리 인코딩.
      // Node.js fetch는 %를 재인코딩하지 않으므로 버전 무관하게 OpenF1이 올바르게 수신.
      // 날짜 값의 콜론/점은 쿼리스트링에서 안전하므로 그대로 사용.
      if (/[<>]/.test(k)) {
        const safeKey = k.replace(/>/g, '%3E').replace(/</g, '%3C')
        return `${safeKey}${new Date(v).toISOString()}`
      }
      return `${k}=${encodeURIComponent(v)}`
    })
    .join('&')
  return `${base}?${qs}`
}

// ─── Binary search helper ─────────────────────────────────────────────────────

function binarySearchNearest(arr: number[], target: number): number {
  if (arr.length === 0) return 0
  let lo = 0
  let hi = arr.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] < target) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }
  if (lo > 0 && Math.abs(arr[lo - 1] - target) < Math.abs(arr[lo] - target)) {
    return lo - 1
  }
  return lo
}

// ─── Timestamp join ───────────────────────────────────────────────────────────

function joinByNearestTime(loc: OpenF1Location[], car: OpenF1CarData[]): RawPoint[] {
  const carSorted = [...car].sort((a, b) => a.date.localeCompare(b.date))
  const carMs = carSorted.map((c) => new Date(c.date).getTime())

  return loc.map((p) => {
    const j = binarySearchNearest(carMs, new Date(p.date).getTime())
    const c = carSorted[j]
    return {
      x: p.x,
      y: p.y,
      speed: c.speed,
      throttle: c.throttle,
      brake: c.brake,
      gear: c.n_gear,
    }
  })
}

// ─── Coordinate normalization ─────────────────────────────────────────────────

function normalizeTraces(
  rawA: RawPoint[],
  rawB: RawPoint[],
): { aPts: TrackPoint[]; bPts: TrackPoint[]; bounds: TrackSpeedBounds } {
  const all = [...rawA, ...rawB]

  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  let speedMin = Infinity, speedMax = -Infinity

  for (const p of all) {
    if (p.x < minX) minX = p.x
    if (p.x > maxX) maxX = p.x
    if (p.y < minY) minY = p.y
    if (p.y > maxY) maxY = p.y
    if (p.speed < speedMin) speedMin = p.speed
    if (p.speed > speedMax) speedMax = p.speed
  }

  const VIEW = 1000
  const PAD = 40
  const scale = (VIEW - 2 * PAD) / Math.max(maxX - minX, maxY - minY, 1)

  const mapPts = (raw: RawPoint[]): TrackPoint[] => {
    const cum: number[] = [0]
    for (let i = 1; i < raw.length; i++) {
      const dx = raw[i].x - raw[i - 1].x
      const dy = raw[i].y - raw[i - 1].y
      cum.push(cum[i - 1] + Math.sqrt(dx * dx + dy * dy))
    }
    const total = cum[cum.length - 1] || 1

    return raw.map((p, i) => ({
      x: Math.round(PAD + (p.x - minX) * scale),
      y: Math.round(VIEW - PAD - (p.y - minY) * scale), // y-axis inversion: OpenF1 up=positive, SVG down=positive
      speed: p.speed,
      throttle: p.throttle,
      brake: p.brake,
      gear: p.gear,
      d: cum[i] / total,
    }))
  }

  return {
    aPts: mapPts(rawA),
    bPts: mapPts(rawB),
    bounds: {
      viewBox: VIEW,
      speedMin: Math.floor(speedMin),
      speedMax: Math.ceil(speedMax),
    },
  }
}

// ─── Single driver trace builder ──────────────────────────────────────────────

async function buildOneDriverTrace(
  sessionKey: number,
  driverNumber: number,
): Promise<DriverRawTrace> {
  const lapsRes = await fetchOF1(
    openF1Url('laps', {
      session_key: String(sessionKey),
      driver_number: String(driverNumber),
    }),
  )
  if (!lapsRes.ok) throw new Error('Failed to fetch laps')

  const laps: OpenF1Lap[] = await lapsRes.json()
  if (!Array.isArray(laps)) throw new Error('Invalid laps data')

  const validLaps = laps.filter(
    (l) => l.lap_duration != null && !l.is_pit_out_lap && l.date_start != null,
  )
  if (validLaps.length === 0) throw new Error('NO_DATA')

  const fastest = validLaps.reduce((a, b) =>
    (a.lap_duration as number) < (b.lap_duration as number) ? a : b,
  )

  const start = fastest.date_start as string
  const endMs = new Date(start).getTime() + (fastest.lap_duration as number) * 1000
  const end = new Date(endMs).toISOString()

  const [locRes, carRes, driverRes] = await Promise.all([
    fetchOF1(openF1Url('location', {
      session_key: String(sessionKey),
      driver_number: String(driverNumber),
      'date>=': start,
      'date<=': end,
    })),
    fetchOF1(openF1Url('car_data', {
      session_key: String(sessionKey),
      driver_number: String(driverNumber),
      'date>=': start,
      'date<=': end,
    })),
    fetchOF1(openF1Url('drivers', {
      session_key: String(sessionKey),
      driver_number: String(driverNumber),
    })),
  ])

  if (!locRes.ok || !carRes.ok || !driverRes.ok) {
    console.error('[track-speed] fetch failed', { loc: locRes.status, car: carRes.status, driver: driverRes.status })
    throw new Error('Failed to fetch trace data')
  }

  const [loc, car, drivers]: [OpenF1Location[], OpenF1CarData[], OpenF1Driver[]] =
    await Promise.all([locRes.json(), carRes.json(), driverRes.json()])

  if (!Array.isArray(loc) || !Array.isArray(car) || !Array.isArray(drivers)) {
    throw new Error('Invalid trace data')
  }
  if (loc.length === 0 || car.length === 0) throw new Error('NO_DATA')

  const driver = drivers[0]
  if (!driver) throw new Error('Driver not found')

  return {
    raw: joinByNearestTime(loc, car),
    code: driver.name_acronym,
    teamColour: '#' + driver.team_colour,
    lapNumber: fastest.lap_number,
    lapDuration: fastest.lap_duration as number,
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export async function buildTrackSpeedData(
  sessionKey: number,
  driverNumbers: [number, number],
): Promise<TrackSpeedData> {
  // 드라이버별 순차 실행 — 동시 실행 시 OpenF1 rate limit(429) 유발
  const traceA = await buildOneDriverTrace(sessionKey, driverNumbers[0])
  const traceB = await buildOneDriverTrace(sessionKey, driverNumbers[1])

  const { aPts, bPts, bounds } = normalizeTraces(traceA.raw, traceB.raw)

  const sessionRes = await fetchOF1(
    openF1Url('sessions', { session_key: String(sessionKey) }),
  )
  const sessionMetas: OpenF1SessionMeta[] = sessionRes.ok ? await sessionRes.json() : []
  const meta = Array.isArray(sessionMetas) ? sessionMetas[0] : null

  return {
    sessionKey,
    circuitShortName: meta?.circuit_short_name ?? 'Unknown',
    bounds,
    drivers: [
      {
        driverNumber: driverNumbers[0],
        code: traceA.code,
        teamColour: traceA.teamColour,
        lapNumber: traceA.lapNumber,
        lapDuration: traceA.lapDuration,
        points: aPts,
      },
      {
        driverNumber: driverNumbers[1],
        code: traceB.code,
        teamColour: traceB.teamColour,
        lapNumber: traceB.lapNumber,
        lapDuration: traceB.lapDuration,
        points: bPts,
      },
    ],
  }
}
