import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

// Vitest ayarı ayrı dosyada: uygulamanın Vite ayarını genişletir, test'e özel her şey burada.
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: false,
      setupFiles: ['./src/test/setup.ts'],
      // Playwright senaryoları Vitest'in işi değil
      exclude: [...configDefaults.exclude, 'e2e/**'],
    },
  }),
)
