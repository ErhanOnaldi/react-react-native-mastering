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
    "Başlıklar için `page.getByRole('list', { name: 'Filmler' }).getByRole('heading')`. Kart için `getByRole('listitem').filter({ has: page.getByRole('heading', { name: title, exact: true }) })`; buton o kart içinde `button` rolüyle aranır.",
  ],
})
