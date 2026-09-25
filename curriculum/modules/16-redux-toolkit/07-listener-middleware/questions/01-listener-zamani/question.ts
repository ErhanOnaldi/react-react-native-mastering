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
      text: 'Reducer öncesi eski state’i.',
      correct: false,
      explanation: 'Listener effect reducer’dan sonra çalışır.',
    },
    {
      text: 'TMDB response’unu.',
      correct: false,
      explanation: 'Bu action client state değiştirir; response içermez.',
    },
  ],
})
