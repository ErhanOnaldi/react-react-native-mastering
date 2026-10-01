import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tasarım değişse de kırılmayan kart locator’ları',
  difficulty: 'orta',
  concepts: ['test.playwright-locators', 'test.rtl-queries', 'a11y.basics'],
  files: ['locators.ts'],
  timeoutMs: 90_000,
  hints: [
    'Her film kartının tasarım sınıfları değişse bile hangi erişilebilir yapı sabit kalıyor? Locator’ları o kullanıcıya görünen sözleşmeden başlat.',
    'Playwright `getByRole` ile role/ad bulur; `filter({ has: locator })` içeriğiyle bir kartı daraltır ve `exact: true` tam başlık eşleşmesi sağlar.',
    'Başlık locator’ında yalnızca ilgili listenin içindeki h3 öğelerini kapsa. Film kartını tam başlık içeren listitem ile bul; favori düğmesini de o kartın içinde ara.',
  ],
})
