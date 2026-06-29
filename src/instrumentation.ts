export async function register() {
  // Railway 같은 Node.js 상시 실행 환경에서만 크론 활성화
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { setupCron } = await import('./lib/cron')
    setupCron()
  }
}
