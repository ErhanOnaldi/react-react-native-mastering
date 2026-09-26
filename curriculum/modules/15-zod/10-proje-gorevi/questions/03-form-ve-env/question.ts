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
    '14. checkpoint’teki form alanlarını ve kayıt sonrası eklenen alanları ayır.',
    '`zodResolver` ile RHF formlarını şemalara bağla; dönüşüm varsa `z.input` ve `z.output` tiplerini ayır.',
    'Kayıt tipinden sistem alanlarını `.omit()` ile çıkar; env değerlerini Zod ile doğrula ve trimle.',
  ],
  rubric: [
    'Tek kaynaklı ve okunur şema tanımları',
    'Bozuk dış veride açık hata akışı',
    'Mevcut Sinema davranışlarını ve erişilebilirliği koruma',
  ],
})
