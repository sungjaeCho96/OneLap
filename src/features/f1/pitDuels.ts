import type { PitDuel } from './pitStrategy'

export const GAP_THRESHOLD_SEC = 20
export const RESOLUTION_BUFFER_MS = 75_000

export interface PitEventInput {
  driverNumber: number
  lapNumber: number
  dateMs: number
}

export interface PositionSampleInput {
  driverNumber: number
  dateMs: number
  position: number
}

export interface IntervalSampleInput {
  driverNumber: number
  dateMs: number
  interval: number | null
}

export interface RaceControlEventInput {
  dateMs: number
  category: string
  message: string
}

export interface SafetyCarPeriod {
  startMs: number
  endMs: number
}

export interface DetectPitDuelsParams {
  pitEvents: readonly PitEventInput[]
  positionSamples: readonly PositionSampleInput[]
  intervalSamples: readonly IntervalSampleInput[]
  finalPositions: ReadonlyMap<number, number | null>
  safetyCarPeriods: readonly SafetyCarPeriod[]
}

// race_control(category==='SafetyCar')의 DEPLOYED~ENDING(/IN THIS LAP) 메시지 쌍으로
// 세이프티카·VSC 구간을 구성한다. 이 구간의 피트스톱은 모두 함께 몰려 들어가는 것이
// 정상이라 전략적 언더컷/오버컷 대결로 보지 않는다.
export function buildSafetyCarPeriods(records: readonly RaceControlEventInput[]): SafetyCarPeriod[] {
  const sorted = [...records]
    .filter((r) => r.category === 'SafetyCar')
    .sort((a, b) => a.dateMs - b.dateMs)

  const periods: SafetyCarPeriod[] = []
  let openStart: number | null = null

  for (const r of sorted) {
    const msg = r.message.toUpperCase()
    if (msg.includes('DEPLOYED')) {
      openStart ??= r.dateMs
    } else if ((msg.includes('ENDING') || msg.includes('IN THIS LAP')) && openStart != null) {
      periods.push({ startMs: openStart, endMs: r.dateMs })
      openStart = null
    }
  }
  if (openStart != null) periods.push({ startMs: openStart, endMs: Infinity })

  return periods
}

function isDuringSafetyCar(dateMs: number, periods: readonly SafetyCarPeriod[]): boolean {
  return periods.some((p) => dateMs >= p.startMs && dateMs <= p.endMs)
}

// 시간순 정렬된 샘플 배열에서 target 이하(nearest-before)인 마지막 항목을 찾는다
function nearestBefore<T extends { dateMs: number }>(samples: readonly T[], targetMs: number): T | null {
  let lo = 0
  let hi = samples.length - 1
  let result: T | null = null
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    if (samples[mid].dateMs <= targetMs) {
      result = samples[mid]
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return result
}

function groupByDriver<T extends { driverNumber: number; dateMs: number }>(
  samples: readonly T[],
): Map<number, T[]> {
  const grouped = new Map<number, T[]>()
  for (const s of samples) {
    const list = grouped.get(s.driverNumber) ?? []
    list.push(s)
    grouped.set(s.driverNumber, list)
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => a.dateMs - b.dateMs)
  }
  return grouped
}

function positionOrderAt(
  driverNumbers: readonly number[],
  positionByDriver: ReadonlyMap<number, PositionSampleInput[]>,
  targetMs: number,
): Map<number, number> {
  const order = new Map<number, number>()
  for (const driverNumber of driverNumbers) {
    const samples = positionByDriver.get(driverNumber)
    if (!samples) continue
    const nearest = nearestBefore(samples, targetMs)
    if (nearest) order.set(driverNumber, nearest.position)
  }
  return order
}

function findRivalAhead(
  driverNumber: number,
  positionOrder: ReadonlyMap<number, number>,
): number | null {
  const myPosition = positionOrder.get(driverNumber)
  if (myPosition == null || myPosition <= 1) return null

  for (const [rivalNumber, rivalPosition] of positionOrder.entries()) {
    if (rivalPosition === myPosition - 1) return rivalNumber
  }
  return null
}

export function detectPitDuels(params: DetectPitDuelsParams): PitDuel[] {
  const { pitEvents, positionSamples, intervalSamples, finalPositions, safetyCarPeriods } = params

  const pitEventsByDriver = groupByDriver(pitEvents)
  const positionByDriver = groupByDriver(positionSamples)
  const intervalByDriver = groupByDriver(intervalSamples)
  const driverNumbers = [...new Set([...pitEventsByDriver.keys(), ...positionByDriver.keys()])]

  const sortedPitEvents = [...pitEvents].sort((a, b) => a.dateMs - b.dateMs)
  const duels: PitDuel[] = []

  for (const event of sortedPitEvents) {
    if (isDuringSafetyCar(event.dateMs, safetyCarPeriods)) continue

    const positionOrder = positionOrderAt(driverNumbers, positionByDriver, event.dateMs)
    const rivalNumber = findRivalAhead(event.driverNumber, positionOrder)
    if (rivalNumber == null) continue

    const intervalSamplesForDriver = intervalByDriver.get(event.driverNumber)
    const gapSample = intervalSamplesForDriver ? nearestBefore(intervalSamplesForDriver, event.dateMs) : null
    if (gapSample == null || gapSample.interval == null || gapSample.interval > GAP_THRESHOLD_SEC) continue

    const rivalEvents = pitEventsByDriver.get(rivalNumber) ?? []
    const rivalAlreadyPitted = rivalEvents.some((e) => e.dateMs < event.dateMs)
    if (rivalAlreadyPitted) continue

    const rivalNextPit = rivalEvents
      .filter((e) => e.dateMs > event.dateMs)
      .sort((a, b) => a.dateMs - b.dateMs)[0] as PitEventInput | undefined

    let undercutterPosition: number | null
    let defenderPosition: number | null

    if (rivalNextPit) {
      const resolveMs = rivalNextPit.dateMs + RESOLUTION_BUFFER_MS
      const finalOrder = positionOrderAt(driverNumbers, positionByDriver, resolveMs)
      undercutterPosition = finalOrder.get(event.driverNumber) ?? null
      defenderPosition = finalOrder.get(rivalNumber) ?? null
    } else {
      undercutterPosition = finalPositions.get(event.driverNumber) ?? null
      defenderPosition = finalPositions.get(rivalNumber) ?? null
    }

    if (undercutterPosition == null || defenderPosition == null) continue

    duels.push({
      undercutterDriverNumber: event.driverNumber,
      defenderDriverNumber: rivalNumber,
      undercutLap: event.lapNumber,
      defenderPitLap: rivalNextPit?.lapNumber ?? null,
      gapAtUndercutSec: gapSample.interval,
      outcome: undercutterPosition < defenderPosition ? 'UNDERCUT_SUCCESS' : 'UNDERCUT_FAILED',
    })
  }

  return duels.sort((a, b) => a.undercutLap - b.undercutLap)
}
