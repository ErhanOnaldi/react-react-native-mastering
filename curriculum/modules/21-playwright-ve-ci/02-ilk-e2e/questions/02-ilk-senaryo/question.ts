import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'İlk E2E senaryon: ana sayfa',
  difficulty: 'kolay',
  concepts: [
    'test.e2e',
    'test.playwright-assertions',
    'test.playwright-locators',
    'test.rtl-queries',
    'fetch.headers-auth',
  ],
  files: ['homeScenario.ts'],
  timeoutMs: 90_000,
  hints: [
    'Üç şeyi doğrulaman gerekiyor: sayfa açıldı, başlıklar doğru, film listesi gerçekten geldi. Sadece başlıkları kontrol eden senaryo, 401 alan sürümü yakalayamaz.',
    "Önce `await page.goto('/')`. Sonra her kontrol için `await expect(locator).toBeVisible()`; locator olarak `page.getByRole('heading', { name: … })` kullan.",
    "Kart başlıkları `<h3>`: `await expect(page.getByRole('heading', { name: 'Dövüş Kulübü' })).toBeVisible()`. h1 için `{ level: 1, name: 'Sinema' }` ver.",
  ],
})
