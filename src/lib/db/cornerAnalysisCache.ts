import { and, eq } from 'drizzle-orm'
import { db } from './index'
import { f1CornerAnalysisCache } from './schema'
import type { CornerAnalysisData } from '@/features/f1/cornerAnalysisBuild'

export async function getCachedCornerAnalysis(
  sessionKey: number,
  algoVersion: number,
): Promise<CornerAnalysisData | null> {
  const rows = await db
    .select()
    .from(f1CornerAnalysisCache)
    .where(
      and(
        eq(f1CornerAnalysisCache.sessionKey, sessionKey),
        eq(f1CornerAnalysisCache.algoVersion, algoVersion),
      ),
    )
    .limit(1)

  return rows.length > 0 ? rows[0].data : null
}

export async function saveCornerAnalysisCache(
  data: CornerAnalysisData,
  algoVersion: number,
): Promise<void> {
  await db
    .insert(f1CornerAnalysisCache)
    .values({ sessionKey: data.sessionKey, algoVersion, data })
    .onConflictDoNothing()
}
