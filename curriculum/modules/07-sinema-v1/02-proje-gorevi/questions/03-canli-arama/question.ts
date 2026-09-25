import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'URL’den canlı film ara',
  difficulty: 'orta',
  concepts: [
    'router.search-params',
    'react.custom-hooks',
    'react.useEffect.deps',
    'fetch.loading-states',
  ],
  project: 'sinema',
  focusFiles: ['src/pages/SearchPage.tsx', 'src/hooks/useDebounce.ts'],
  reviewFiles: ['src/pages/SearchPage.tsx'],
  rubric: [
    'q URL’de tek kaynak',
    'Boş sorgu TMDB isteği atmıyor',
    'Sorgu değişince sayfa sıfırlanıyor',
  ],
  hints: [
    '`useSearchParams` ile `q` ve `page` oku; input değerini `q` ile bağla.',
    '`useDebounce(q, 350)` ile ağ sorgusunu geciktir; boş metinde isteği atla.',
    '`/search/movie` yoluna `query` ve `page` gönder; `results` dizisini kartlarda göster.',
  ],
})
