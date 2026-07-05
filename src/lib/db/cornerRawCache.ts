import { eq } from 'drizzle-orm'
import { db } from './index'
import { f1CornerRawCache } from './schema'
import type { RawSessionBundle } from '@/features/f1/cornerAnalysisBuild'

export async function getCachedRawSession(sessionKey: number): Promise<RawSessionBundle | null> {
  const rows = await db
    .select()
    .from(f1CornerRawCache)
    .where(eq(f1CornerRawCache.sessionKey, sessionKey))
    .limit(1)

  return rows.length > 0 ? rows[0].data : null
}

export async function saveRawSessionCache(bundle: RawSessionBundle): Promise<void> {
  await db
    .insert(f1CornerRawCache)
    .values({ sessionKey: bundle.sessionKey, data: bundle })
    .onConflictDoNothing()
}
