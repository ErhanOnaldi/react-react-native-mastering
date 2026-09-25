import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'Form ve env için tek kaynak',
  difficulty: 'zor',
  concepts: ['zod.resolver', 'zod.env', 'form.rhf-errors', 'tooling.env'],
  project: 'sinema',
  focusFiles: [
    'src/features/watchlists/schemas.ts',
    'src/features/watchlists/WatchlistForm.tsx',
    'src/features/watchlists/ReviewForm.tsx',
    'src/shared/config/env.ts',
  ],
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
