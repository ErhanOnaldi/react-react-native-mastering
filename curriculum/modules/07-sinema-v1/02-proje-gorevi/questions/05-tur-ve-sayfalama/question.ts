import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Tür filtresi ve sayfalama ekle',
  difficulty: 'zor',
  concepts: [
    'router.search-params',
    'fetch.query-params',
    'react.derived-state',
    'fetch.loading-states',
  ],
  project: 'sinema',
  focusFiles: ['src/pages/HomePage.tsx', 'src/pages/SearchPage.tsx'],
  reviewFiles: ['src/pages/HomePage.tsx', 'src/pages/SearchPage.tsx'],
  rubric: [
    'Tür değişimi page değerini sıfırlıyor',
    'URL aynı görünümü yeniden kuruyor',
    'total_pages sınırı aşılamıyor',
  ],
  hints: [
    '`/genre/movie/list` ile seçilebilir tür adlarını al.',
    '`genre` varsa `/discover/movie?with_genres=...`, yoksa `/trending/movie/week` isteği yap.',
    '`page` URL’de kalsın; tür değişince sil, Sonraki düğmesini `page < total_pages` iken göster.',
  ],
})
