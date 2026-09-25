import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Bozuk cevabı açıklayarak durdur',
  difficulty: 'orta',
  concepts: ['ts.type-guards', 'ts.unknown-any', 'ts.functions'],
  files: ['task.ts'],
  hints: [
    'Assertion fonksiyonu yanlış veride mutlaka throw etmeli.',
    'Önce üst nesne, page ve results dizisini doğrula.',
    'every ile her öğenin id/title alanını kontrol et.',
  ],
})
