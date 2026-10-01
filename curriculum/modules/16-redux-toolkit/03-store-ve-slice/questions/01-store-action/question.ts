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
      text: 'Action creator reducer’ı hemen çalıştırır; sonra store state’i günceller.',
      correct: false,
      explanation:
        'Action creator action nesnesi üretir. Reducer ancak action dispatch edilince çalışır.',
    },
    {
      text: 'Action yalnız UI etiketini değiştirir; store’da favori listesi aynı kalır.',
      correct: false,
      explanation:
        'Store’a bağlanmış reducer state’i değiştirir; UI değişikliği yeni selector değerinden gelir.',
    },
  ],
})
