import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'use ve sabit Promise',
  difficulty: 'orta',
  concepts: ['react.use', 'react.suspense', 'query.suspense'],
  question:
    'Oyuncu verisini `use(promise)` ile okuyacaksın. Her render’da yeni Promise oluşturursan ne olur?',
  options: [
    {
      text: 'Tekrarlayan askıya alma riski doğar; Promise sabit bir kaynaktan gelmeli',
      correct: true,
      explanation:
        'use, Promise tamamlanana kadar Suspense sınırına askıya alır. Her render’da yeni Promise üretmek ilerlemeyi engelleyebilir.',
    },
    {
      text: 'React Promise’leri otomatik olarak URL’ye göre cache’ler',
      correct: false,
      explanation:
        'İstemci render’ında yeni Promise’leri otomatik URL cache’i gibi kabul etme. TanStack Query cache’i ayrı bir katmandır.',
    },
    {
      text: 'use yalnız event handler içinde çağrılır',
      correct: false,
      explanation: 'use render sırasında okunur; Promise için yakınında Suspense gerekir.',
    },
  ],
})
