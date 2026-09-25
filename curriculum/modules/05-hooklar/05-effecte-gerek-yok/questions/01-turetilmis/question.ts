import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Filtreyi nerede hesaplamalı?',
  difficulty: 'kolay',
  concepts: ['react.derived-state', 'js.array-methods'],
  question: '`movies` ve `query` zaten state. `visibleMovies` nasıl tutulmalı?',
  options: [
    {
      text: 'Render sırasında `movies.filter(...)` ile hesaplanmalı.',
      correct: true,
      explanation: 'Aynı bilgiyi ikinci state’te tutmak senkron hatası doğurur.',
    },
    {
      text: 'Effect içinde `setVisibleMovies` ile kopyalanmalı.',
      explanation: 'Bu ek render ve kısa süreli eski değer üretir.',
    },
    {
      text: 'Ref’te saklanmalı.',
      explanation: 'Ref değişimi render tetiklemez, ekrandaki veri için uygun değildir.',
    },
  ],
})
