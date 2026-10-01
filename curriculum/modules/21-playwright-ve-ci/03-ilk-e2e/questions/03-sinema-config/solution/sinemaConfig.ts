import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test'

export interface SinemaConfigOptions {
  /** CI’da mı koşuyoruz? Gerçek dosyada: `!!process.env.CI` */
  ci: boolean
}

const SINEMA_URL = 'http://localhost:5174'

/**
 * Sinema’nın Playwright ayarı. Gerçek `playwright.config.ts` şöyle kullanır:
 * `export default createSinemaConfig({ ci: !!process.env.CI })`
 */
export function createSinemaConfig({ ci }: SinemaConfigOptions): PlaywrightTestConfig {
  return defineConfig({
    testDir: './e2e',
    use: { baseURL: SINEMA_URL },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
    webServer: {
      command: 'pnpm dev',
      url: SINEMA_URL,
      reuseExistingServer: !ci,
      env: { VITE_TMDB_TOKEN: 'e2e-sahte-token' },
    },
  })
}
