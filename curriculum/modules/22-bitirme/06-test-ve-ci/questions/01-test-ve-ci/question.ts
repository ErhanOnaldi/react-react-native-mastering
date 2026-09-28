import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Test ve CI',
  difficulty: 'zor',
  concepts: [
    'tooling.ci',
    'test.what-to-test',
    'test.rtl-queries',
    'test.user-event',
    'test.msw',
    'test.msw-overrides',
    'test.e2e',
    'test.playwright-network',
  ],
  project: 'kitaplik',
  focusFiles: [
    'src/test/setup.ts',
    'src/test/msw/handlers.ts',
    'playwright.config.ts',
    '.github/workflows/ci.yml',
  ],
  reviewFiles: [
    'src/**/*.test.{ts,tsx}',
    'src/test/**/*.{ts,tsx}',
    'e2e/**/*.ts',
    '.github/workflows/*.yml',
    'docs/adr/0003-*.md',
  ],
  rubric: [
    'Testler REQUIREMENTS.md kriterlerine bağlanıyor ve kullanıcı davranışını görünür çıktıyla doğruluyor mu?',
    'Saf mantık testleri (şema/depolama), bileşen testleri ve E2E akışı farklı riskleri kapsıyor mu; aynı testi üç katmanda kopyalamıyor mu?',
    'MSW handler’ları gerçek ağ yerine deterministik arama, eser ve yazar cevapları veriyor; 404/500 gibi hata yolları test ediliyor mu?',
    'E2E testleri page.route ile Open Library ağını taklit ediyor; erişilebilir locator ve bekleme mekanizması kullanıyor mu?',
    'CI push ve pull_request olaylarında lint, format, tip kontrolü, birim testleri, build ve E2E çalıştırıyor mu?',
    'Yayına hazırlık adımları doğrulanıyor mu: üretim derlemesi (build) ve statik varlık kontrolü CI hattında koşuyor, SPA fallback ve cache/önbellek stratejisi belgelenmiş mi?',
    'Test stratejisi ADR’si hangi davranışın hangi katmanda test edildiğini ve bilinçli açık riskleri açıklıyor mu?',
  ],
  hints: [
    'Testleri katmanlara böl: saf mantık ve Zod şemaları için birim testleri; RTL + MSW ile bileşen/kullanıcı etkileşimi testleri; Playwright ile kritik kullanıcı akışı (E2E) testleri.',
    'Bileşen testlerinde MSW handler’larını deterministik kur; hata senaryolarında `server.use(...)` ile geçici override yap. E2E testinde ise `page.route` kullanarak dış ağ isteklerini mock’la.',
    'CI hattında (`.github/workflows/ci.yml`) şu adımları zincirle: checkout → pnpm/Node kurulumu → install → lint + format:check + typecheck + test + build → playwright install chromium → test:e2e.',
    'Aynı testi üç ayrı katmanda kopyalama (piramit kuralı). E2E testinde sabit zamanlayıcı (`waitForTimeout`) kullanma; erişilebilir locator’ların doğal bekleme mekanizmasına güven.',
  ],
  timeoutMs: 240000,
})
