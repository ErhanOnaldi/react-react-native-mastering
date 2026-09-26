import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'CI adımlarını sırala',
  difficulty: 'orta',
  concepts: ['tooling.ci', 'test.e2e', 'test.vitest-basics'],
  files: ['ciSteps.ts'],
  hints: [
    'Temiz makinede önce bağımlılıklar kurulmalı; lint ve typecheck hızlı kontrollerdir.',
    'Vitest `pnpm test` ile, Playwright `npx playwright test` ile çalışır; browser binary’sini ayrıca kur.',
    'Sıra: install → lint → typecheck → test → playwright install → playwright test. İkinci dizide `--with-deps chromium` bulunmalı.',
  ],
})
