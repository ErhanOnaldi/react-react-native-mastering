import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sinema’nın Playwright config’i',
  difficulty: 'orta',
  concepts: ['test.playwright-config', 'tooling.env', 'zod.env', 'tooling.scripts'],
  files: ['sinemaConfig.ts'],
  hints: [
    'Tarayıcı ve server adresini, test klasörünü ve yerel/CI sunucu farkını tek tek çıkar. Önce hangi ayarların birbiriyle aynı kaynağı göstermesi gerektiğini belirle.',
    '`@playwright/test` config API’sinde `defineConfig` ve `devices` kullan; CI davranışını ci girdisine göre belirle.',
    "`const url = 'http://localhost:5174'` sabitini kullan. Config’te `testDir: './e2e'`, Chromium Desktop Chrome projesi ve webServer için `command: 'pnpm dev'`, aynı url, `reuseExistingServer: !ci` ve sahte token env’i döndür.",
  ],
})
