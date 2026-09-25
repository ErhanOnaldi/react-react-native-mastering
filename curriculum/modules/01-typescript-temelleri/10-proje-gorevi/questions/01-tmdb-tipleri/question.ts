import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Sinema TMDB liste tipleri',
  difficulty: 'orta',
  concepts: [
    'ts.object-types',
    'ts.arrays-tuples',
    'ts.union',
    'ts.api-types',
    'tooling.type-check',
  ],
  project: 'sinema',
  focusFiles: ['src/types/tmdb.ts'],
  hints: [
    'TMDB fixture’ındaki liste öğesi ile detay cevabını karıştırma; `genre_ids` liste öğesindedir.',
    '`poster_path` ve `backdrop_path` için `string | null` yaz; boş `release_date` yine string’dir.',
    '`MovieListResponse.results` alanını `Movie[]` olarak yaz, sayfa alanlarını number yap.',
  ],
})
