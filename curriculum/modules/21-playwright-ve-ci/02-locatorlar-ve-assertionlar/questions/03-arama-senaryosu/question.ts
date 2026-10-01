import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Beklemesiz arama senaryosu',
  difficulty: 'zor',
  concepts: [
    'test.playwright-assertions',
    'test.playwright-locators',
    'router.search-params',
    'test.e2e',
  ],
  files: ['searchScenario.ts'],
  timeoutMs: 120_000,
  hints: [
    'Her adımdan sonra hangi kullanıcıya görünen koşul tamamlanmış olmalı? İlk aramanın sonuçları gelmeden yeni ifadeye geçme.',
    'Otomatik yeniden deneme için Playwright web-first `expect` assertion’larını kullan. URL query’si `toHaveURL` içinde `URL.searchParams` ile incelenebilir.',
    "`goto('/search')` → `searchbox` alanına matrix yaz → sonuç bölgesinde iki `listitem` bekle → başlangıç yaz → q parametresini, tam adlı bağlantıyı, tek maddeyi ve gizli Aranıyor… durumunu doğrula.",
  ],
})
