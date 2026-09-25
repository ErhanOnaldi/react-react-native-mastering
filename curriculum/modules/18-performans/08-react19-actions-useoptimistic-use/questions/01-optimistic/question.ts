import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hata olursa ne görünür?',
  difficulty: 'kolay',
  concepts: ['react.useOptimistic'],
  question:
    'Favori async isteği sırasında useOptimistic ile kalp doldu; istek hata verdi. Doğru akış?',
  options: [
    {
      text: 'Geçici görünüm temel state’e geri döner',
      correct: true,
      explanation: 'Optimistic görünüm yalnız bekleyen işlemin geçici katmanıdır.',
    },
    {
      text: 'Kalp sonsuza kadar dolu kalır',
      correct: false,
      explanation: 'Başarısız istek gerçek state’i değiştirmemiştir.',
    },
    {
      text: 'use() ile isteği her render’da yeniden oluştururum',
      correct: false,
      explanation: 'Render’da yeni promise üretmek askıya alma döngüsü doğurabilir.',
    },
  ],
})
