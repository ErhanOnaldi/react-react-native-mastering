import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // .env dosyası repo kökünde (react_mastering/.env): tek bir yerde tutuyoruz
  envDir: '../..',
  server: { port: 5174 },
})
