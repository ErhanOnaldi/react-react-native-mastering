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
    'Trend için tek sayfa `useQuery` yerine `useInfiniteQuery` kullan.',
    '`getNextPageParam` içinde `last.page < last.total_pages` kontrol et; `data.pages.flatMap` ile listele.',
    'Kartın hover olayında `prefetchQuery(movieQueries.detail(id))`; detay sayfasında aynı key.',
  ],
  rubric: [
    'Trendde sayfalar birikir ve son sayfada istek durur.',
    'Tür filtresi mevcut sayfalama akışıyla çalışır.',
    'Hover prefetch ve detay aynı key’i kullanarak ağ tekrarını önler.',
  ],
})
