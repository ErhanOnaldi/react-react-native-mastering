import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film kartını doğrula',
  difficulty: 'orta',
  concepts: ['zod.schemas', 'ts.optional-nullable'],
  files: ['movie.ts'],
  hints: [
    'Önce gerçek TMDB alanlarında hangilerinin null olabildiğini ayır.',
    '`z.object` içinde `id` için `.int().positive()`, poster için `.nullable()` uygula.',
    'Başlığı `z.string().min(1, { error: "Başlık gerekli" })` ile kur ve `parseMovie` içinde `.parse(raw)` döndür.',
  ],
})
