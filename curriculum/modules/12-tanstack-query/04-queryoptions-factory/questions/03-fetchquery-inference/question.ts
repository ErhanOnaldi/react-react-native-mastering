import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tariften tip çıkarımı',
  difficulty: 'orta',
  concepts: ['query.query-options', 'ts.inference', 'ts.generics'],
  files: ['loadMovieTitle.ts'],
  hints: [
    'Salt okunur `movieQueries.detail(id)` tarifini kullan.',
    '`await client.fetchQuery(...)` dönüşünde `title` alanına eriş.',
    '`const movie = await client.fetchQuery(movieQueries.detail(id)); return movie.title` yaz.',
  ],
})
