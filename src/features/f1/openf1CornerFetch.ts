// 코너 분석 전용 OpenF1 fetch 헬퍼 — sessions/drivers/session_result/stints/race_control/
// laps/location/car_data 엔드포인트를 감싼다. fetchOF1/openF1Url(429 재시도 포함)을 그대로 사용.

import {
  fetchOF1,
  openF1Url,
  type OpenF1Driver,
  type OpenF1SessionMeta,
  type OpenF1Lap,
  type OpenF1Location,
  type OpenF1CarData,
} from './openf1'
import type { RaceControlEventInput } from './safetyCar'

interface OpenF1Stint {
  driver_number: number
  stint_number: number
  lap_start: number
  lap_end: number
}

interface OpenF1ResultEntry {
  driver_number: number
  number_of_laps: number
  dnf: boolean
  dns: boolean
  dsq: boolean
}

interface OpenF1RaceControl {
  category: string
  message: string
  date: string
}

async function fetchJsonArray<T>(url: string, label: string, noStore = false): Promise<T[]> {
  const res = await fetchOF1(url, 0, noStore)
  if (!res.ok) throw new Error(`OpenF1 fetch failed(${label}): ${res.status}`)
  const json: unknown = await res.json()
  if (!Array.isArray(json)) throw new Error(`Invalid ${label} data from OpenF1`)
  return json as T[]
}

export async function fetchSessionMeta(
  sessionKey: number,
): Promise<{ circuitShortName: string; countryName: string }> {
  const metas = await fetchJsonArray<OpenF1SessionMeta>(
    openF1Url('sessions', { session_key: String(sessionKey) }),
    'sessions',
  )
  const meta = metas[0]
  return {
    circuitShortName: meta?.circuit_short_name ?? 'Unknown',
    countryName: meta?.country_name ?? 'Unknown',
  }
}

export async function fetchSessionDrivers(sessionKey: number): Promise<OpenF1Driver[]> {
  return fetchJsonArray<OpenF1Driver>(
    openF1Url('drivers', { session_key: String(sessionKey) }),
    'drivers',
  )
}

export interface DriverResultInfo {
  numberOfLaps: number
  dnf: boolean
  dns: boolean
  dsq: boolean
}

export async function fetchSessionResultMap(
  sessionKey: number,
): Promise<Map<number, DriverResultInfo>> {
  const results = await fetchJsonArray<OpenF1ResultEntry>(
    openF1Url('session_result', { session_key: String(sessionKey) }),
    'session_result',
  )
  return new Map(
    results.map((r) => [
      r.driver_number,
      { numberOfLaps: r.number_of_laps, dnf: r.dnf, dns: r.dns, dsq: r.dsq },
    ]),
  )
}

export interface DriverStintInfo {
  pitOutLapNumbers: Set<number>
  pitInLapNumbers: Set<number>
}

export interface StintFetchResult {
  totalLaps: number
  stintsByDriver: Map<number, DriverStintInfo>
}

// totalLaps = 전체 드라이버 기준 max(lap_end) (pit-strategy와 동일 계산)
export async function fetchStintInfo(sessionKey: number): Promise<StintFetchResult> {
  const stints = await fetchJsonArray<OpenF1Stint>(
    openF1Url('stints', { session_key: String(sessionKey) }),
    'stints',
  )

  const byDriver = new Map<number, OpenF1Stint[]>()
  let totalLaps = 0
  for (const s of stints) {
    if (s.lap_end > totalLaps) totalLaps = s.lap_end
    byDriver.set(s.driver_number, [...(byDriver.get(s.driver_number) ?? []), s])
  }

  const stintsByDriver = new Map<number, DriverStintInfo>()
  for (const [driverNumber, driverStints] of byDriver.entries()) {
    const sorted = [...driverStints].sort((a, b) => a.stint_number - b.stint_number)
    stintsByDriver.set(driverNumber, {
      pitOutLapNumbers: new Set(sorted.filter((s) => s.stint_number > 1).map((s) => s.lap_start)),
      pitInLapNumbers: new Set(sorted.slice(0, -1).map((s) => s.lap_end)),
    })
  }

  return { totalLaps, stintsByDriver }
}

export async function fetchRaceControlEvents(sessionKey: number): Promise<RaceControlEventInput[]> {
  const events = await fetchJsonArray<OpenF1RaceControl>(
    openF1Url('race_control', { session_key: String(sessionKey) }),
    'race_control',
  )
  return events.map((e) => ({
    dateMs: new Date(e.date).getTime(),
    category: e.category,
    message: e.message,
  }))
}

export async function fetchDriverLaps(sessionKey: number, driverNumber: number): Promise<OpenF1Lap[]> {
  return fetchJsonArray<OpenF1Lap>(
    openF1Url('laps', { session_key: String(sessionKey), driver_number: String(driverNumber) }),
    'laps',
  )
}

// 레이스 전체 구간 응답(수 MB)이라 Next.js Data Cache 용량 제한을 피하려 noStore로 호출
export async function fetchDriverLocation(
  sessionKey: number,
  driverNumber: number,
): Promise<OpenF1Location[]> {
  return fetchJsonArray<OpenF1Location>(
    openF1Url('location', { session_key: String(sessionKey), driver_number: String(driverNumber) }),
    'location',
    true,
  )
}

export async function fetchDriverCarData(
  sessionKey: number,
  driverNumber: number,
): Promise<OpenF1CarData[]> {
  return fetchJsonArray<OpenF1CarData>(
    openF1Url('car_data', { session_key: String(sessionKey), driver_number: String(driverNumber) }),
    'car_data',
    true,
  )
}
