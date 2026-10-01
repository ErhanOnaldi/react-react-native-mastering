import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Thunk nerede uygun?',
  difficulty: 'kolay',
  concepts: ['redux.async-thunk'],
  question: 'Hangi iş için `createAsyncThunk` daha makul?',
  options: [
    {
      text: 'Watchlist dışa aktarma işleminin pending/fulfilled/rejected durumunu paylaşmak.',
      correct: true,
      explanation: 'Bu bir kullanıcı işlemi; TMDB cache’i değildir.',
    },
    {
      text: 'TMDB detayını Query ile birlikte ikinci kez cache’lemek.',
      correct: false,
      explanation: 'İki cache aynı veriyi ayrı ayrı yaşatır.',
    },
    {
      text: 'Bir ekrandaki geçici arama metnini her tuşta Redux’a göndermek.',
      correct: false,
      explanation:
        'Geçici giriş alanı form veya yerel UI state’idir; paylaşılan işlem yaşam döngüsü değildir.',
    },
  ],
})
