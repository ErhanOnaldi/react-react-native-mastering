import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'TMDB film şemaları',
  difficulty: 'zor',
  concepts: ['zod.schemas', 'zod.infer', 'ts.api-types'],
  project: 'sinema',
  focusFiles: ['src/features/movies/api/schemas.ts', 'src/features/movies/types.ts'],
  hints: [
    'Mevcut TMDB tipleriyle liste ve detay fixture’larının alanlarını karşılaştır.',
    'Ortak film alanlarını temel şemada tanımla; detayda `genre_ids` bulunmadığı için uygun alanları seçerek türet.',
    '`src/features/movies/types.ts` tiplerini `z.infer` ile şemalardan çıkar; null poster geçerli, null başlık geçersiz olmalı.',
  ],
  rubric: [
    'Tek kaynaklı ve okunur şema tanımları',
    'Bozuk dış veride açık hata akışı',
    'Mevcut Sinema davranışlarını ve erişilebilirliği koruma',
  ],
})
