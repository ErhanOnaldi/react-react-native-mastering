import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Dört state’i yerleştir',
  difficulty: 'kolay',
  concepts: ['arch.state-categories'],
  question:
    '`?q=matrix`, WatchlistForm taslağı, `theme=dark`, TMDB arama sonuçları için doğru sıra hangisi?',
  options: [
    {
      text: 'URL, RHF, Redux client slice, TanStack Query',
      correct: true,
      explanation:
        'Her verinin ömrü farklıdır: paylaşılabilir URL, geçici form, kalıcı tercih, sunucu cache’i.',
    },
    {
      text: 'Redux, Redux, Redux, Redux',
      correct: false,
      explanation:
        'Her şeyi store’a taşımak URL paylaşımını ve sunucu cache özelliklerini kaybettirir.',
    },
    {
      text: 'Query, RHF, Query, URL',
      correct: false,
      explanation: 'Query sunucu kaynaklı veriyi yönetir; tema ve arama metni buna uymaz.',
    },
  ],
})
