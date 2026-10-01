import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Promise içindeki tip',
  difficulty: 'kolay',
  concepts: ['ts.async-types'],
  question: '`Awaited<Promise<Movie[]>>` hangi tipi verir?',
  options: [
    {
      text: '`Movie[]`',
      correct: true,
      explanation: 'Awaited Promise katmanını açar; dizi ve içindeki Movie tipi aynı kalır.',
    },
    {
      text: '`Promise<Movie[]>`',
      explanation: 'Awaited Promise katmanını açar, bu yüzden sonuç artık Promise değildir.',
    },
    { text: '`Movie`', explanation: 'Promise açılır, dizi açılmaz.' },
  ],
})
