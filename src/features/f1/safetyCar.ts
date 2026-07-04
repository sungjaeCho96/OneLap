// race_control(category==='SafetyCar')의 DEPLOYED~ENDING(/IN THIS LAP) 메시지 쌍으로
// 세이프티카·VSC 구간을 구성한다. 이 구간에서는 코너 벤치마크 랩을 유효 랩으로 취급하지 않는다.

export interface RaceControlEventInput {
  dateMs: number
  category: string
  message: string
}

export interface SafetyCarPeriod {
  startMs: number
  endMs: number
}

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

export function isDuringSafetyCar(dateMs: number, periods: readonly SafetyCarPeriod[]): boolean {
  return periods.some((p) => dateMs >= p.startMs && dateMs <= p.endMs)
}
