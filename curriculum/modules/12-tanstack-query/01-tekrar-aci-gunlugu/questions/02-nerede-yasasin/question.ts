import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Veri nerede yaşasın?',
  difficulty: 'kolay',
  concepts: ['arch.state-categories', 'router.search-params', 'react.state'],
  question: `Sinema'da kullanıcı arama bağlantısını paylaşabilsin, TMDB sonucu ekrandan ayrılınca kısa süre saklansın, yıldızla işaretlediği favori ise kendi seçimi olarak kalsın. Bu üç değerin sahibi nasıl ayrılır?`,
  options: [
    {
      text: '`q` URL’de, TMDB cevabı Query cache’inde, favori seçimi client state’te',
      correct: true,
      explanation: 'Üç durumun ömrü ve sahibi farklıdır.',
    },
    {
      text: 'Arama ve favoriyi URL’de, TMDB cevabını `useState` içinde tut',
      explanation:
        'URL yalnız paylaşılması gereken seçimi taşır; API cevabını component state’ine kopyalamak ekranlar arası tekrar kullanımı sağlamaz.',
    },
    {
      text: 'Arama, TMDB cevabı ve favoriyi Query cache’ine taşı',
      explanation:
        'Kullanıcının favori seçimi ve paylaşılabilir URL parametresi sunucu cevabı değildir.',
    },
  ],
})
