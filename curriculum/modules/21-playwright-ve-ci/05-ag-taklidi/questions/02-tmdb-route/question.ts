import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB aramasını route ile taklit et',
  difficulty: 'orta',
  concepts: ['test.playwright-network', 'test.msw-overrides', 'test.playwright-locators'],
  files: ['mockSearch.ts'],
  hints: [
    'Route’u `page.route` ile kur; callback içinde `route.request().url()` adresini URL olarak çöz.',
    '`query` parametresini kontrol et; sonuçları TMDB’nin `{ page, results, total_pages, total_results }` zarfında döndür.',
    'İstekte Bearer başlığı yoksa önce `status: 401` ile `status_code: 7` döndür; doğru başlıkta “dövüş” için 550, başka sorguda boş liste ver.',
  ],
})
