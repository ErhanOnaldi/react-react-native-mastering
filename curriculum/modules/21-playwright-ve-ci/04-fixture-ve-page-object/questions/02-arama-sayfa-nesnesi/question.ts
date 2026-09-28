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
    'Sayfa yardımcılarının kullanıcı niyetini taşımasını sağla. Eski sonuçlar bir süre görünür kaldığında, yeni işlemin tamamlandığını hangi görünür metin kanıtlar?',
    '`Locator` değerlerini sınıf alanı olarak tut; Playwright allTextContents() anlık okuması kendi başına beklemez. Bekleme için web-first expect kullan.',
    'search(query) alanı doldurup region içindeki sorgu başlığını beklesin. openMovie(title) tam adı eşleşen linke tıklasın ve level 2 aynı adlı heading’i beklesin; resultTitles() link metinlerini diziye çevirsin.',
  ],
})
