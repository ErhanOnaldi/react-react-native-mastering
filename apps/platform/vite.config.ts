import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type HotPayload, type Plugin } from 'vite'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const workspaceRoot = path.join(repoRoot, 'workspace')

/**
 * Öğrenci kodundaki derleme hataları (ör. yazarken yarım kalan sözdizimi) Vite'ın tam ekran
 * hata katmanını açmasın: bu hatalar `rm:workspace-error` olayı olarak yalnızca önizlemeye gider.
 */
function workspaceErrorsToPreview(): Plugin {
  return {
    name: 'rm-workspace-errors-to-preview',
    apply: 'serve',
    configureServer(server) {
      const hot = server.environments.client.hot
      const send = hot.send.bind(hot) as (...args: unknown[]) => void
      hot.send = ((...args: unknown[]) => {
        const payload = args[0] as HotPayload | string
        if (typeof payload === 'object' && payload.type === 'error') {
          const { err } = payload
          const file = err.id ?? err.loc?.file ?? ''
          if (file.startsWith(workspaceRoot) || err.message.includes(workspaceRoot)) {
            send({
              type: 'custom',
              event: 'rm:workspace-error',
              data: {
                message: err.message,
                file: path.basename(file),
                line: err.loc?.line,
                column: err.loc?.column,
                frame: err.frame,
              },
            })
            return
          }
        }
        send(...args)
      }) as typeof hot.send
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), workspaceErrorsToPreview()],
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
