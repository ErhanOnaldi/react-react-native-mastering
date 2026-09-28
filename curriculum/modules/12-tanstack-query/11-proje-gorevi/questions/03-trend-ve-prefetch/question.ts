import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sonsuz trend ve hover prefetch',
  difficulty: 'zor',
  concepts: ['query.infinite', 'query.prefetch', 'query.query-options', 'test.msw'],
  project: 'sinema',
  focusFiles: [
    'src/pages/HomePage.tsx',
    'src/features/movies/components/MovieCard.tsx',
    'src/features/movies/api/movie-queries.ts',
  ],
  hints: [
    'Önce trend ekranında değişen tek sayfa ile biriken sayfaların beklenen farkını belirle.',
    '`useInfiniteQuery` için başlangıç parametresi, son sayfa hesabı ve üç sayfalık bellek sınırı ekle.',
    '`data.pages.flatMap` ile birleştir; kart etkileşiminde `prefetchQuery(movieQueries.detail(id))` çağır.',
  ],
  rubric: [
    'Trendde sayfalar birikir ve son sayfada istek durur.',
    'Tür filtresi mevcut sayfalama akışıyla çalışır.',
    'Hover prefetch ve detay aynı key’i kullanarak ağ tekrarını önler.',
  ],
})
