import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'TMDB film şemaları',
  difficulty: 'zor',
  concepts: ['zod.schemas', 'zod.infer', 'ts.api-types'],
  project: 'sinema',
  focusFiles: ['src/features/movies/api/schemas.ts', 'src/features/movies/types.ts'],
  hints: [
    'Önce 14. checkpoint’teki mevcut tipleri ve form alanlarını oku.',
    'Zod şemasını dış verinin girdiği sınırda kullan; `z.infer` ile tipleri tek kaynağa bağla.',
    'Testteki bozuk veri örneğini çalıştır; hata veri ekrana ulaşmadan oluşmalı.',
  ],
  rubric: [
    'Tek kaynaklı ve okunur şema tanımları',
    'Bozuk dış veride açık hata akışı',
    'Mevcut Sinema davranışlarını ve erişilebilirliği koruma',
  ],
})
