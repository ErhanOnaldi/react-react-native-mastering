import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema için GitHub Actions kalite kapısı',
  difficulty: 'orta',
  concepts: [
    'tooling.ci',
    'test.vitest-basics',
    'test.e2e',
    'test.playwright-debug',
    'tooling.node-runtime',
    'tooling.lockfile',
  ],
  project: 'sinema',
  focusFiles: ['.github/workflows/sinema-ci.yml', 'playwright.config.ts'],
  reviewFiles: ['.github/workflows/sinema-ci.yml'],
  rubric: [
    'Workflow push ve pull request üzerinde temiz makinede çalışır.',
    'pnpm lockfile sabitlenir; lint, typecheck, Vitest ve Playwright ayrı adımlardır.',
    'Chromium ve sistem bağımlılıkları kurulur; başarısız E2E trace dosyaları artifact olarak saklanır.',
  ],
  hints: [
    'Repo kökünde `.github/workflows/sinema-ci.yml` oluştur; checkout, pnpm ve Node kurulumunu ekle.',
    'Sinema komutlarını `projects/sinema` dizininde çalıştır; install monorepo kökünde `--frozen-lockfile` ile olsun.',
    'Sıra: lint → typecheck → test → `playwright install --with-deps chromium` → E2E. `if: failure()` ile `test-results/` artifact’ını yükle.',
  ],
})
