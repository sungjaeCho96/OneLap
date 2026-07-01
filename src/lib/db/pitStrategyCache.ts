import { eq } from 'drizzle-orm'
import { db } from './index'
import { f1PitStrategyCache } from './schema'
import type { PitStrategyData } from '@/features/f1/pitStrategy'

export async function getCachedPitStrategy(sessionKey: number): Promise<PitStrategyData | null> {
  const rows = await db
    .select()
    .from(f1PitStrategyCache)
    .where(eq(f1PitStrategyCache.sessionKey, sessionKey))
    .limit(1)

  return rows.length > 0 ? rows[0].data : null
}

export async function savePitStrategyCache(data: PitStrategyData): Promise<void> {
  await db
    .insert(f1PitStrategyCache)
    .values({ sessionKey: data.sessionKey, data })
    .onConflictDoNothing()
}
