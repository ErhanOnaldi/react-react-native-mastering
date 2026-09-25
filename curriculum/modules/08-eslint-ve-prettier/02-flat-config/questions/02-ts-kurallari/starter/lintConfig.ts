import { defineConfig } from 'eslint/config'

// Şimdilik TS dosyalarına özel kural yok.
export const config = defineConfig({ files: ['**/*.js'] })
