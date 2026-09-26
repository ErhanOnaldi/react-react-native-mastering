import { defineConfig, devices } from '@playwright/test'

const PORT = 5174
const BASE_URL = `http://localhost:${PORT}`
const isCI = Boolean(process.env.CI)

// Sinema'nın E2E ayarı: gerçek tarayıcıda ana sayfa→arama→detay ve
// giriş→izleme listesi akışlarını doğrular. Ağ her zaman page.route ile
// taklit edilir; bu yüzden token gerçek olmak zorunda değil, sadece boş olmamalı.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['json', { outputFile: 'test-results/report.json' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !isCI,
    env: { VITE_TMDB_TOKEN: 'e2e-sahte-token' },
  },
})
