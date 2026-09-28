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
    'Yalnızca sayfanın açıldığını değil, kullanıcının gördüğü program sonucunu da doğrula. Hangi görünür içerik yüklenmediğinde akış başarısız sayılmalı?',
    'Playwright web-first assertion’ı `expect(locator).toBeVisible()` biçiminde kullan; locator’ı erişilebilir heading veya link rolüyle bul.',
    "Göreli olarak `/` adresine git; ardından `getByRole('heading', { level: 1, name: 'Sinema' })`, bölüm başlığı ve Dövüş Kulübü başlığının görünmesini ayrı ayrı bekle.",
  ],
})
