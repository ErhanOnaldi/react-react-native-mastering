import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Temiz CI makinesinde ne eksik?',
  difficulty: 'orta',
  concepts: ['tooling.ci', 'test.playwright-config'],
  question:
    'Workflow’da `pnpm install` ve `npx playwright test` var; CI, “Executable doesn’t exist” diyor. Hangi adım eksik?',
  options: [
    {
      text: 'E2E öncesi `npx playwright install --with-deps chromium`',
      correct: true,
      explanation: 'Paket kodu kurulmuş olsa da Chromium binary’si temiz makinede ayrıca kurulur.',
    },
    {
      text: '`waitForTimeout(5000)`',
      correct: false,
      explanation: 'Uygulama beklemesi olmayan tarayıcı dosyasını oluşturmaz.',
    },
    {
      text: 'Yalnızca `pnpm test` komutunu ikinci kez çalıştırmak',
      correct: false,
      explanation: 'Vitest tekrar çalışınca Playwright browser binary’si kurulmaz.',
    },
  ],
  explanation: '',
})
