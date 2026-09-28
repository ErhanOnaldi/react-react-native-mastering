import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tariften tip çıkarımı',
  difficulty: 'orta',
  concepts: ['query.query-options', 'ts.inference', 'ts.generics'],
  files: ['loadMovieTitle.ts'],
  hints: [
    'Detay query tanımı salt okunur dosyada hazır; onu yeniden kurma.',
    '`QueryClient.fetchQuery` tarifin dönüş tipini çağırana taşır.',
    '`const movie = await client.fetchQuery(movieQueries.detail(id)); return movie.title`.',
  ],
})
