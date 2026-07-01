import type { Config } from 'drizzle-kit'

// drizzle-kit은 .env.local을 자동 로딩하지 않으므로 직접 로드
try {
  process.loadEnvFile('.env.local')
} catch {
  // .env.local이 없거나 환경변수가 직접 주입된 경우 무시
}

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config
