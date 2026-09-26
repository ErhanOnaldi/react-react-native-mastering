import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sinema’nın Playwright config’i',
  difficulty: 'orta',
  concepts: ['test.playwright-config', 'tooling.env', 'zod.env', 'tooling.scripts'],
  files: ['sinemaConfig.ts'],
  hints: [
    'Dört ayar yeterli: `testDir`, `use.baseURL`, `projects` ve `webServer`. Adresi (`http://localhost:5174`) bir sabite koyarsan `baseURL` ile `webServer.url` hiç ayrışmaz.',
    '`reuseExistingServer` CI’ın tersidir: `!ci`. Token’ı `webServer.env` içinde ver; uygulamanın `env.ts`’i onu `import.meta.env.VITE_TMDB_TOKEN` olarak görür.',
    "Proje: `{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }`. Sunucu: `{ command: 'pnpm dev', url: SINEMA_URL, reuseExistingServer: !ci, env: { VITE_TMDB_TOKEN: 'e2e-sahte-token' } }`.",
  ],
})
