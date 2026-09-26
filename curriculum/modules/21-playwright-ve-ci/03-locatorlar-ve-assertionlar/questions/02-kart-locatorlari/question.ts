import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tasarım değişse de kırılmayan kart locator’ları',
  difficulty: 'orta',
  concepts: ['test.playwright-locators', 'test.rtl-queries', 'a11y.basics'],
  files: ['locators.ts'],
  timeoutMs: 90_000,
  hints: [
    'Class’lara ve sıraya değil, role ve ada yaslan. Listenin bir erişilebilir adı var (`aria-label="Filmler"`); kartlar `listitem`, başlıkları `heading`.',
    "Kartı bulmak için listitem’ları, içinde **tam** o başlığı taşıyana göre süz: `filter({ has: page.getByRole('heading', { name, exact: true }) })`. Butonu kartın içinde ara.",
    "Butonun adı tıklayınca değişiyor; ad için düzenli ifade kullan: `movieCard(page, title).getByRole('button', { name: /^Favori/ })`. Başlıklar: `page.getByRole('list', { name: 'Filmler' }).getByRole('heading')`.",
  ],
})
