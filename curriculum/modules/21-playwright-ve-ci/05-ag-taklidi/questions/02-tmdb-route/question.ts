import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB aramasını route ile taklit et',
  difficulty: 'orta',
  concepts: ['test.playwright-network', 'test.msw-overrides', 'test.playwright-locators'],
  files: ['mockSearch.ts'],
  hints: [
    'Uygulamanın dışarı gönderdiği isteği ve servis cevabını ayrı düşün. Hangi koşulda isteğin kimliği geçerli sayılmalı?',
    'Playwright `page.route` ile browser isteğini yakalar; callback’te URL query’sini ve Authorization başlığını okuyup uygun HTTP yanıtı verebilirsin.',
    'GET arama isteği için URL’yi `new URL(route.request().url())` ile çöz. Bearer yoksa `{ status_code: 7 }` ile 401; dövüş ise 550/Dövüş Kulübü, diğer sorguda boş `results` ver. Liste zarfını page=1, total_pages=1 ve sonuç sayısıyla tamamla.',
  ],
})
