import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Sonraki sayfa',
  difficulty: 'kolay',
  concepts: ['query.infinite', 'js.array-methods'],
  question: 'Son cevap `{page: 3, total_pages: 3}`. `getNextPageParam` ne döndürmeli?',
  options: [
    {
      text: '`undefined`',
      correct: true,
      explanation: 'Son sayfada yeni sayfa yok; hasNextPage false olur.',
    },
    { text: '`4`', explanation: 'TMDB toplam sayfa 3 dedi; 4 geçersizdir.' },
    { text: '`3`', explanation: 'Aynı sayfayı tekrar istemek listeyi çoğaltır.' },
  ],
})
