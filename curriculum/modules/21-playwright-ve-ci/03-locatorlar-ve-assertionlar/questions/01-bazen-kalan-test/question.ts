import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Bazen geçen, bazen kalan test',
  difficulty: 'orta',
  concepts: ['test.playwright-assertions', 'test.async', 'test.fake-timers'],
  question: `Arama sayfasında 350 ms debounce var, TMDB cevabı da 200–600 ms sürüyor. Bu test yerelde çoğunlukla geçiyor, CI’da çoğunlukla kalıyor:

\`\`\`ts
test('arama sonucu gösterir', async ({ page }) => {
  await page.goto('/search')
  await page.getByLabel('Film ara').fill('başlangıç')
  expect(await page.getByRole('link', { name: 'Başlangıç' }).isVisible()).toBe(true)
})
\`\`\`

Doğru düzeltme hangisi?`,
  options: [
    {
      text: "Son satırı `await expect(page.getByRole('link', { name: 'Başlangıç' })).toBeVisible()` yapmak",
      correct: true,
      explanation:
        'Doğru. `isVisible()` o anki durumu **bir kez** döndürür; debounce ve ağ bitmeden bakarsa `false` alır. Web-first assertion koşul sağlanana kadar (varsayılan 5 sn) tekrar dener ve sonuç gelir gelmez devam eder: hızlı makinede hızlı, yavaş makinede sabırlı.',
    },
    {
      text: '`fill`’den sonra `await page.waitForTimeout(1000)` eklemek',
      explanation:
        'Belirtiyi bastırır, hastalığı değil. Her koşuda 1 sn boşa gider; CI makinesi yoğunken 1 sn de yetmez ve test yine kalır. Sabit bekleme, “ne kadar bekleyeceğini bilmediğin” yerde tahmindir.',
    },
    {
      text: 'Test süresini (`timeout`) 60 saniyeye çıkarmak',
      explanation:
        'Test süresi, testin **toplam** ne kadar sürebileceğidir. `isVisible()` zaten beklemediği için hemen `false` döner ve test ilk saniyede kalır; süreyi artırmak hiçbir şey değiştirmez.',
    },
    {
      text: 'Locator’ı `.first()` ile daraltmak',
      explanation:
        '`.first()` birden çok eşleşme sorununu çözer; burada sorun zamanlama. Sonuç henüz yokken “ilk eşleşme” de yoktur.',
    },
    {
      text: 'Tarayıcıda da `vi.useFakeTimers()` ile debounce’u atlamak',
      explanation:
        '`vi.useFakeTimers()` Vitest’in Node sürecindeki saati taklit eder; Playwright’ın açtığı tarayıcıya dokunmaz. Tarayıcıdaki saati kontrol etmek gerekirse Playwright’ın `page.clock` API’si var (6. derste). Ama burada saate ihtiyaç yok: beklemeyi assertion’a bırakmak yeter.',
    },
  ],
})
