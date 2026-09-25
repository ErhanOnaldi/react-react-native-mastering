import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Action akışı',
  difficulty: 'kolay',
  concepts: ['redux.store'],
  question: '`toggleFavorite(550)` dispatch edildiğinde hangi sıralama doğru?',
  options: [
    {
      text: 'Action reducer’a gider, yeni state oluşur, ilgili selector sonucuna göre UI güncellenir.',
      correct: true,
      explanation: 'Reducer saf dönüşümü yapar; aboneler sonucu okur.',
    },
    {
      text: 'Önce localStorage reducer’dan yazılır, sonra action yaratılır.',
      correct: false,
      explanation: 'Yan etki reducer’ın görevi değildir; listener ayrı çalışır.',
    },
    {
      text: 'TMDB yeniden fetch edilmeden favori değişemez.',
      correct: false,
      explanation: 'Favori ID’si client state’tir; ağ şart değildir.',
    },
  ],
})
