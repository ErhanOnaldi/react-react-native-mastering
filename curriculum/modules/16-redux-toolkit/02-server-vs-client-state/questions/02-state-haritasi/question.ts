import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Dört state’i yerleştir',
  difficulty: 'kolay',
  concepts: ['arch.state-categories', 'redux.server-vs-client'],
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
      text: 'URL, Redux client slice, TanStack Query, RHF',
      correct: false,
      explanation:
        'Sıra karışmış: form taslağı URL’de, tema ise RHF içinde yaşamaz. Her alan kendi yaşam döngüsüne göre seçilir.',
    },
    {
      text: 'Query, RHF, Query, URL',
      correct: false,
      explanation: 'Query sunucu kaynaklı veriyi yönetir; tema ve arama metni buna uymaz.',
    },
  ],
})
