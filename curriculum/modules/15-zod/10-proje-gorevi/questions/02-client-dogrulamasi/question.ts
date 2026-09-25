import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'API client’ı şemayla doğrula',
  difficulty: 'zor',
  concepts: ['zod.api-validation', 'arch.api-client', 'test.msw-overrides'],
  project: 'sinema',
  focusFiles: ['src/shared/api/tmdb-client.ts', 'src/features/movies/api/movies-api.ts'],
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
