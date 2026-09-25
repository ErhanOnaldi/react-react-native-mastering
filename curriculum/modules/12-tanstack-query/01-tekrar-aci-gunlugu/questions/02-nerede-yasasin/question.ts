import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Veri nerede yaşasın?',
  difficulty: 'kolay',
  concepts: ['arch.state-categories', 'router.search-params', 'react.state'],
  question:
    'Arama metni paylaşılan URL’de, TMDB cevabı ise tekrar kullanılmalı. Hangi eşleştirme doğru?',
  options: [
    {
      text: '`q` URL’de, cevap Query cache’inde, favori seçimi client state’te',
      correct: true,
      explanation: 'Üç durumun ömrü ve sahibi farklıdır.',
    },
    {
      text: 'Üçünü de `useState` içinde tut',
      explanation: 'Sayfa unmount olunca API cevabı kaybolur; URL paylaşımı da bozulur.',
    },
    {
      text: 'Üçünü de Query cache’ine taşı',
      explanation:
        'Kullanıcının favori seçimi ve paylaşılabilir URL parametresi sunucu cevabı değildir.',
    },
  ],
})
