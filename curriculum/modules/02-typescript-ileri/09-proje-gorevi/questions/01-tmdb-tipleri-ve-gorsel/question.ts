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
    'Liste ve detay cevaplarını karşılaştır; ortak alanlar ile yalnız belirli endpointte görünenleri ayır.',
    '`Omit`, `Paginated<T>` ve opsiyonel nested alanları kullanarak cevap tiplerini türet.',
    'Poster helper içinde null için erken dön; varsayılan boyutu parametre varsayılanında ver.',
    'TMDB path başında slash bulunduğu için host sonundaki slash ile birleştirirken çift slash üretme.',
  ],
})
