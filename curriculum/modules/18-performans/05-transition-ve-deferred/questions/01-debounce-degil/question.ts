import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Deferred değer neyi çözmez?',
  difficulty: 'kolay',
  concepts: ['perf.transitions'],
  question: 'useDeferredValue ile input akıcılaştı. Hangi sorun ayrıca çözülmelidir?',
  options: [
    {
      text: 'Her harfteki TMDB istek sayısı',
      correct: true,
      explanation: 'Deferred rendering ağ debounce’u değildir; istek politikasını ayrı kurarsın.',
    },
    {
      text: 'Controlled inputun güncel değeri',
      correct: false,
      explanation: 'Input acil state’e bağlı kalır.',
    },
    {
      text: 'Liste güncellemesinin önceliği',
      correct: false,
      explanation: 'Deferred değer tam bunu etkiler.',
    },
  ],
})
