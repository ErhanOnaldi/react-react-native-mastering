import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { configDefaults, defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // .env dosyası repo kökünde (react_mastering/.env): tek bir yerde tutuyoruz
  envDir: '../..',
  server: { port: 5174 },
  test: {
    environment: 'jsdom',
    globals: false,
    // Playwright'ın e2e/*.spec.ts dosyaları Vitest testi değil; aksi halde `pnpm test` onları da çalıştırmaya çalışır.
    exclude: [...configDefaults.exclude, 'e2e/**'],
    setupFiles: [
      fileURLToPath(new URL('./src/test/setup.ts', import.meta.url)),
    ],
    // Testler gerçek .env'e (ve gizli token'a) bağlı olmamalı: CI'da ve temiz klonda da çalışsın
    env: { VITE_TMDB_TOKEN: 'test-token', VITE_APP_TITLE: 'Sinema' },
  },
})
