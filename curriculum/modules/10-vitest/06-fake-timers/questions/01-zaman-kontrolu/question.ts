import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: '500 ms sınırı',
  difficulty: 'kolay',
  concepts: ['test.fake-timers', 'react.custom-hooks'],
  question:
    'Debounce 500 ms. 499 ms sonra eski değer, 500 ms sonra yeni değer bekleniyor. Hangi yöntem hızlı ve deterministiktir?',
  options: [
    {
      text: '`vi.useFakeTimers()` ve `act` içinde `vi.advanceTimersByTime`',
      correct: true,
      explanation: 'Saati kontrollü ilerletirsin; React güncellemeleri act içinde uygulanır.',
    },
    {
      text: 'Her testte gerçek `setTimeout(500)` beklemek',
      correct: false,
      explanation: 'Yavaşlatır ve zamanlama değişkenliğine yol açar; sınırı hassas ölçmek zordur.',
    },
    {
      text: 'Timer’ı atlayıp sadece ilk render’ı sınamak',
      correct: false,
      explanation: 'Debounce’un asıl bekleme davranışı hiç kontrol edilmez.',
    },
  ],
})
