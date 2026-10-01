import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Listener ne okur?',
  difficulty: 'kolay',
  concepts: ['redux.listener'],
  question: '`toggleFavorite` action’ını dinleyen listener, `getState()` ile hangi state’i okur?',
  options: [
    {
      text: 'Reducer sonrası güncel state’i.',
      correct: true,
      explanation: 'Persistence için yeni state gerekir.',
    },
    {
      text: 'Action payload’ındaki state kopyasını; store’dan tekrar okumaz.',
      correct: false,
      explanation:
        'Action payload yalnız olay verisini taşır; listener güncel store state’ini API üzerinden okur.',
    },
    {
      text: 'Reducer’ın ürettiği state değişmeden önceki snapshot’ı.',
      correct: false,
      explanation:
        'Listener effect reducer tamamlandıktan sonra çalıştığı için güncel state’i görür.',
    },
  ],
})
