import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // .env dosyası repo kökünde (react_mastering/.env): tek bir yerde tutuyoruz
  envDir: '../..',
  server: { port: 5174 },
  test: { environment: 'jsdom', globals: false },
})
