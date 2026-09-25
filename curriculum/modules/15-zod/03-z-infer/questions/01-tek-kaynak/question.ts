import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Tipin kaynağı',
  difficulty: 'kolay',
  concepts: ['zod.infer', 'ts.inference'],
  question: 'Şemada `name` zorunluysa form değer tipini nasıl güncel tutarsın?',
  options: [
    {
      text: '`z.infer<typeof watchlistSchema>` ile çıkarırım.',
      correct: true,
      explanation: 'Doğru. Çıktı tipi şema değişince birlikte değişir.',
    },
    {
      text: 'Ayrı interface yazarım; editör eşitliği kanıtlar.',
      correct: false,
      explanation: 'Ayrı interface şema ile kendiliğinden senkron olmaz.',
    },
    {
      text: '`as` ile form verisini tipe çeviririm.',
      correct: false,
      explanation: 'Assertion çalışma zamanı kuralını değiştirmez.',
    },
  ],
})
