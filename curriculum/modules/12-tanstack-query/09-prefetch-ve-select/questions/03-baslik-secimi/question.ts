import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Başlıkları select ile oku',
  difficulty: 'orta',
  concepts: ['query.select', 'ts.inference', 'js.array-methods'],
  files: ['MovieTitles.tsx'],
  hints: [
    '`queryFn` gerçek TMDB listesini döndürmeli.',
    '`select: page => page.results.map(movie => movie.title)` kullan.',
    'Başarı dalında `query.data` artık `string[]`; bunu `<ol>` içinde render et.',
  ],
})
