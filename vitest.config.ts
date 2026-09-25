import { defineConfig } from 'vitest/config'

// Platformun kendi testleri. (Öğrenci egzersizleri ayrı bir config ile runner üzerinden çalışır.)
export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.ts', 'apps/*/vitest.config.ts'],
  },
})
