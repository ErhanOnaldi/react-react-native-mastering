import { defineConfig, devices, type PlaywrightTestConfig } from '@playwright/test'

export interface SinemaConfigOptions {
  /** CI’da mı koşuyoruz? Gerçek dosyada: `!!process.env.CI` */
  ci: boolean
}

/**
 * Sinema’nın Playwright ayarı. Gerçek `playwright.config.ts` şöyle kullanır:
 * `export default createSinemaConfig({ ci: !!process.env.CI })`
 */
export function createSinemaConfig({ ci }: SinemaConfigOptions): PlaywrightTestConfig {
  return defineConfig({
    // Buraya yaz
  })
}
