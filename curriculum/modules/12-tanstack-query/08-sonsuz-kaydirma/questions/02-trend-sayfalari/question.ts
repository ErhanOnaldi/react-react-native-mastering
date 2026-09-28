import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Trend sayfalarını biriktir',
  difficulty: 'orta',
  concepts: ['query.infinite', 'query.keys', 'js.array-methods'],
  files: ['TrendingFeed.tsx'],
  hints: [
    'Yeni sayfayı eskilerin yerine koymak ile aynı listede biriktirmek arasındaki farkı düşün.',
    '`useInfiniteQuery` içinde `initialPageParam`, `getNextPageParam` ve `maxPages` tanımla.',
    '`pageParam` ile isteği yap; `data.pages.flatMap(page => page.results)` ile sırayı koru.',
  ],
})
