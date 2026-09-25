import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Immer ve eski snapshot',
  difficulty: 'kolay',
  concepts: ['react.immutability'],
  question: 'Slice reducer’ında `state.ids.unshift(550)` kullandın. Doğru beklenti hangisi?',
  options: [
    {
      text: 'Immer yeni state üretir, eski state dizisi değişmez.',
      correct: true,
      explanation: 'Reducer’a verilen state draft’tır.',
    },
    {
      text: 'Eski state dizisi de değişir.',
      correct: false,
      explanation: 'RTK draft değişikliklerini immutable sonuca dönüştürür.',
    },
    {
      text: 'Bu syntax RTK’de yasaktır.',
      correct: false,
      explanation: 'Draft üzerinde okunur mutasyon RTK’nin temel kullanım biçimidir.',
    },
  ],
})
