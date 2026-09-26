import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama sayfası için page object',
  difficulty: 'zor',
  concepts: [
    'test.playwright-fixtures',
    'test.playwright-locators',
    'test.playwright-assertions',
    'arch.separation-of-concerns',
  ],
  files: ['SearchPage.ts'],
  timeoutMs: 90_000,
  hints: [
    'Locator’ları constructor’da bir kez kur; metotlar onları kullansın. Asıl zor kısım `search()`’ün **neyi** beklediği: yeni sorguyu yazdığında eski sonuçlar hâlâ ekranda, “Aranıyor…” da debounce bitene kadar görünmüyor.',
    'Sonuç bölgesi her aramada bir başlık gösterir: `“matrix” için 2 sonuç`. Bu başlık yalnızca **o** sorgunun cevabı geldiğinde görünür; `search()` onu beklesin. `resultTitles()` için `allTextContents()` beklemez, zaten beklemesi gerekmiyor.',
    "`search`: `fill(query)` + `await expect(region.getByRole('heading', { name: `“${query}” için` })).toBeVisible()`. `openMovie`: bağlantıya `exact: true` ile tıkla, sonra `getByRole('heading', { level: 2, name: title, exact: true })` görünür olsun.",
  ],
})
