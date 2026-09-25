import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Trend sayfalarını biriktir',
  difficulty: 'orta',
  concepts: ['query.infinite', 'query.keys', 'js.array-methods'],
  files: ['TrendingFeed.tsx'],
  hints: [
    '`queryFn` içindeki `pageParam` değerini URL’ye koy.',
    '`getNextPageParam` için `last.page < last.total_pages` karşılaştır.',
    '`feed.data.pages.flatMap(page => page.results)` ile listeyi oluştur.',
  ],
})
