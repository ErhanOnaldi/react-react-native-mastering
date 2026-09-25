import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Zod hatasını okunur yap',
  difficulty: 'orta',
  concepts: ['zod.api-validation', 'zod.schemas'],
  files: ['errors.ts'],
  hints: [
    'Bozuk liste öğesinin hangi alanının sorunlu olduğunu düşün.',
    '`results` dizisini iç içe `z.object` ile doğrula; başlığa `.min(1)` ekle.',
    '`safeParse` başarısızsa `z.prettifyError(result.error)` döndür, başarıda null.',
  ],
})
