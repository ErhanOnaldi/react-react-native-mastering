import { defineConfig, devices } from '@playwright/test'

// Platformun uçtan uca duman testi: fixture müfredatla, ayrı portlarda ve geçici durum klasörüyle.
const SERVER_PORT = 4417
const PLATFORM_PORT = 5273
const env = {
  RM_CURRICULUM: 'fixtures/mini-curriculum',
  RM_PROJECTS: 'fixtures/projects',
  RM_STATE_DIR: '.cache/e2e-state',
  RM_SERVER_PORT: String(SERVER_PORT),
  RM_PLATFORM_PORT: String(PLATFORM_PORT),
}

export default defineConfig({
  testDir: 'e2e',
  timeout: 90_000,
  expect: { timeout: 30_000 },
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PLATFORM_PORT}`,
    trace: 'retain-on-failure',
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 900 },
  },
  webServer: [
    {
      command: 'rm -rf .cache/e2e-state && node apps/server/src/main.ts',
      url: `http://127.0.0.1:${SERVER_PORT}/api/health`,
      env,
      reuseExistingServer: false,
    },
    {
      command: 'pnpm --filter @rm/platform dev',
      url: `http://127.0.0.1:${PLATFORM_PORT}`,
      env,
      reuseExistingServer: false,
    },
  ],
})
