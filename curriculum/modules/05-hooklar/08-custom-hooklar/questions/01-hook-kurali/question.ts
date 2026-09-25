import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Custom hook nerede çağrılır?',
  difficulty: 'kolay',
  concepts: ['react.custom-hooks', 'react.useEffect'],
  question: '`useFetch` iki sayfada kullanılacak. Hangi çağrı React hook kurallarına uyar?',
  options: [
    {
      text: 'Bileşenin üst seviyesinde `useFetch(url)`.',
      correct: true,
      explanation: 'Hook sırası her render’da aynı kalır.',
    },
    {
      text: '`if (url) useFetch(url)`.',
      explanation: 'Koşul değişince hook çağrı sırası değişir; null parametre gönder.',
    },
    {
      text: 'Bir event handler içinde `useFetch(url)`.',
      explanation: 'Hook’lar render sırasında bileşen veya custom hook üst seviyesinde çağrılır.',
    },
  ],
})
