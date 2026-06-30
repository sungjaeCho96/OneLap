import { eq, and } from 'drizzle-orm'
import { db } from './index'
import { f1TrackSpeedCache } from './schema'
import type { TrackSpeedData } from '@/features/f1/trackSpeed'

// driverNumberA < driverNumberB 를 보장하여 순서 무관하게 동일 row 사용
function sortedDriverPair(a: number, b: number): [number, number] {
  return a < b ? [a, b] : [b, a]
}

export async function getCachedTrackSpeed(
  sessionKey: number,
  driverNumbers: [number, number],
): Promise<TrackSpeedData | null> {
  const [numA, numB] = sortedDriverPair(driverNumbers[0], driverNumbers[1])

  const rows = await db
    .select()
    .from(f1TrackSpeedCache)
    .where(
      and(
        eq(f1TrackSpeedCache.sessionKey, sessionKey),
        eq(f1TrackSpeedCache.driverNumberA, numA),
        eq(f1TrackSpeedCache.driverNumberB, numB),
      ),
    )
    .limit(1)

  if (rows.length === 0) return null

  const row = rows[0]
  const [reqA, reqB] = driverNumbers
  const swapped = reqA > reqB

  return {
    sessionKey: row.sessionKey,
    circuitShortName: row.circuitShortName,
    bounds: {
      viewBox: row.viewBox,
      speedMin: row.speedMin,
      speedMax: row.speedMax,
    },
    drivers: [
      {
        driverNumber: swapped ? row.driverNumberB : row.driverNumberA,
        code: swapped ? row.driverBCode : row.driverACode,
        teamColour: swapped ? row.driverBTeamColour : row.driverATeamColour,
        lapNumber: swapped ? row.driverBLapNumber : row.driverALapNumber,
        lapDuration: swapped ? row.driverBLapDuration : row.driverALapDuration,
        points: swapped ? row.driverBPoints : row.driverAPoints,
      },
      {
        driverNumber: swapped ? row.driverNumberA : row.driverNumberB,
        code: swapped ? row.driverACode : row.driverBCode,
        teamColour: swapped ? row.driverATeamColour : row.driverBTeamColour,
        lapNumber: swapped ? row.driverALapNumber : row.driverBLapNumber,
        lapDuration: swapped ? row.driverALapDuration : row.driverBLapDuration,
        points: swapped ? row.driverAPoints : row.driverBPoints,
      },
    ],
  }
}

export async function saveTrackSpeedCache(data: TrackSpeedData): Promise<void> {
  const [driverA, driverB] = data.drivers
  const [numA, numB] = sortedDriverPair(driverA.driverNumber, driverB.driverNumber)
  const swapped = driverA.driverNumber > driverB.driverNumber

  const a = swapped ? driverB : driverA
  const b = swapped ? driverA : driverB

  await db
    .insert(f1TrackSpeedCache)
    .values({
      sessionKey: data.sessionKey,
      driverNumberA: numA,
      driverNumberB: numB,
      circuitShortName: data.circuitShortName,
      speedMin: data.bounds.speedMin,
      speedMax: data.bounds.speedMax,
      viewBox: data.bounds.viewBox,
      driverACode: a.code,
      driverATeamColour: a.teamColour,
      driverALapNumber: a.lapNumber,
      driverALapDuration: a.lapDuration,
      driverAPoints: a.points,
      driverBCode: b.code,
      driverBTeamColour: b.teamColour,
      driverBLapNumber: b.lapNumber,
      driverBLapDuration: b.lapDuration,
      driverBPoints: b.points,
    })
    .onConflictDoNothing()
}
