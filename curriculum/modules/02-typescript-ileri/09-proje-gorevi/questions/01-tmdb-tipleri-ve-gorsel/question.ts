import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'TMDB tipleri ve poster URL’si',
  difficulty: 'zor',
  concepts: [
    'ts.generics',
    'ts.omit',
    'ts.pick',
    'ts.optional-nullable',
    'ts.api-types',
    'fetch.tmdb-images',
  ],
  project: 'sinema',
  focusFiles: ['src/types/tmdb.ts', 'src/lib/tmdb-image.ts'],
  hints: [
    'Trend ve detay fixture’larının anahtarlarını karşılaştır; `genre_ids` detayda yok.',
    '`MovieDetails` için `Omit<Movie, "genre_ids">` tabanı kullan; `credits` ve `videos` opsiyoneldir.',
    'Poster URL’si için null erken dönüşü ve `https://image.tmdb.org/t/p/${size}${path}` biçimini kullan.',
  ],
})
