// OpenF1 API 공유 유틸 — trackSpeed.ts, cornerAnalysis 계열에서 공용으로 사용

// ─── OpenF1 raw response types ────────────────────────────────────────────────

export interface OpenF1Lap {
  driver_number: number
  lap_number: number
  lap_duration: number | null
  date_start: string | null
  is_pit_out_lap: boolean
}

export interface OpenF1Location {
  date: string
  driver_number: number
  x: number
  y: number
}

export interface OpenF1CarData {
  date: string
  driver_number: number
  speed: number
  throttle: number
  brake: number
  n_gear: number
}

export interface OpenF1Driver {
  driver_number: number
  name_acronym: string
  first_name: string
  last_name: string
  team_name: string
  team_colour: string
}

export interface OpenF1SessionMeta {
  session_key: number
  circuit_short_name: string
  country_name: string
}

// ─── Internal pipeline types ──────────────────────────────────────────────────

export interface RawPoint {
  x: number
  y: number
  speed: number
  throttle: number
  brake: number
  gear: number
}

// ─── Fetch with retry ────────────────────────────────────────────────────────

const OF1_FETCH_OPTS = { next: { revalidate: 86400 } } as const

// 레이스 전체 구간 location/car_data는 응답이 수 MB에 달해 Next.js Data Cache의
// 2MB 제한("items over 2MB can not be cached")에 걸린다 — 이런 대용량 응답은
// noStore=true로 호출해 Data Cache 시도 자체를 건너뛴다(원본 fetch 실패가 아니라
// 캐시 저장 실패였을 뿐이지만, 매 요청마다 실패 로그가 반복되는 걸 막기 위함).
export async function fetchOF1(url: string, attempt = 0, noStore = false): Promise<Response> {
  const res = await fetch(url, noStore ? { cache: 'no-store' } : OF1_FETCH_OPTS)
  // 429 Rate Limit: 1회 재시도 (1s 대기)
  if (res.status === 429 && attempt < 1) {
    await new Promise((r) => setTimeout(r, 1000))
    return fetchOF1(url, attempt + 1, noStore)
  }
  return res
}

// ─── URL builder ─────────────────────────────────────────────────────────────

export function openF1Url(endpoint: string, params: Record<string, string>): string {
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

export function binarySearchNearest(arr: number[], target: number): number {
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

export function joinByNearestTime(loc: OpenF1Location[], car: OpenF1CarData[]): RawPoint[] {
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
