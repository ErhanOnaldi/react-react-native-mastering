import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'CI adımlarını sırala',
  difficulty: 'orta',
  concepts: ['tooling.ci', 'test.e2e', 'test.vitest-basics', 'tooling.eslint', 'tooling.lockfile'],
  files: ['ciSteps.ts'],
  hints: [
    'Temiz runner’da hangi kaynaklar önceden yoktur? Kontrolleri maliyeti düşük olandan browser gerektirene doğru sırala.',
    'Playwright CLI’da browser kurulumu `playwright install --with-deps` komutuyla yapılır; Vitest ve Playwright ayrı runner komutlarıdır.',
    'Diziyi install, lint, typecheck, test, browser install ve E2E olarak sırala. Komut metinleri: `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `npx playwright install --with-deps chromium`, `npx playwright test`.',
  ],
})
