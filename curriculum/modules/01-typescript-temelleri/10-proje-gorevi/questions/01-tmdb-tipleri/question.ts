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
    'TMDB liste öğesi ile detay cevabını karıştırma; `genre_ids` liste öğesindedir.',
    '`poster_path` ve `backdrop_path` alanlarını `string | null` olarak modelle; boş gelen `release_date` yine `string` türündedir.',
    'İskelet: `export interface Movie { id: number; title: string; ... } export interface MovieListResponse { page: number; results: Movie[]; total_pages: number; total_results: number; }`',
    '`movie-550.json` dosyasındaki detay yapısını baz alma; orada `genres` nesne dizisi bulunurken liste öğesinde `genre_ids: number[]` bulunur.',
  ],
})
