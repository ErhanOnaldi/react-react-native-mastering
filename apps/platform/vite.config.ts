import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const repoRoot = path.resolve(import.meta.dirname, '../..')

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      // Canlı önizleme, testlerle aynı sahte TMDB API'sini kullanır
      '@test-env': path.join(repoRoot, 'curriculum/test-env'),
    },
    dedupe: ['react', 'react-dom'],
  },
  // Önizlemedeki egzersiz kodu gerçek token'ı asla görmez; istekler MSW'ye gider
  define: {
    'import.meta.env.VITE_TMDB_TOKEN': JSON.stringify('preview-token'),
  },
  server: {
    host: '127.0.0.1',
    port: Number(process.env.RM_PLATFORM_PORT ?? 5173),
    strictPort: true,
    proxy: { '/api': { target: `http://127.0.0.1:${process.env.RM_SERVER_PORT ?? 4317}` } },
    // workspace/ dosyaları önizlemede /@fs/ üzerinden yüklenir
    fs: { allow: [repoRoot] },
  },
  build: {
    rolldownOptions: {
      input: {
        main: path.resolve(import.meta.dirname, 'index.html'),
        preview: path.resolve(import.meta.dirname, 'preview.html'),
      },
    },
  },
})
