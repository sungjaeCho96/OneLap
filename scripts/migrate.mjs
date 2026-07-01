import { readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import pg from 'pg'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// 로컬 개발 시 .env.local 로드 (없으면 무시)
try {
  process.loadEnvFile(join(root, '.env.local'))
} catch {
  // Railway 등 환경변수 직접 주입 환경에서는 무시
}

const { DATABASE_URL } = process.env
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL이 설정되지 않았습니다.')
  process.exit(1)
}

const client = new pg.Client({ connectionString: DATABASE_URL })
await client.connect()

// 마이그레이션 이력 테이블
await client.query(`
  CREATE TABLE IF NOT EXISTS _migrations (
    filename TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ DEFAULT NOW()
  )
`)

const migrationsDir = join(root, 'drizzle')
const files = readdirSync(migrationsDir)
  .filter((f) => f.endsWith('.sql'))
  .sort()

for (const file of files) {
  const { rows } = await client.query(
    'SELECT 1 FROM _migrations WHERE filename = $1',
    [file],
  )
  if (rows.length > 0) {
    console.log(`  skip: ${file}`)
    continue
  }

  const sql = readFileSync(join(migrationsDir, file), 'utf-8')
  await client.query(sql)
  await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file])
  console.log(`  applied: ${file}`)
}

await client.end()
console.log('Migrations complete.')
