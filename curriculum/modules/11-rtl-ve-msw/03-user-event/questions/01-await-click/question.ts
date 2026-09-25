import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Neden await?',
  difficulty: 'kolay',
  concepts: ['test.user-event', 'react.events'],
  question: 'user.click(...) çağrısını neden await edersin?',
  options: [
    {
      text: 'user-event etkileşim dizisi Promise döndürür; sonuçtan önce bitmesini beklersin',
      correct: true,
      explanation: 'Click birkaç DOM olayı gönderebilir; assertion önce başlamamalı.',
    },
    {
      text: 'React click handler’ları daima fetch yapar',
      explanation: 'Handler senkron da olabilir; await gereği user-event API’sinden gelir.',
    },
    {
      text: 'await olmadan buton hiç tıklanmaz',
      explanation: 'Etkileşim başlayabilir; sorun bitmeden assertion koşmasıdır.',
    },
  ],
})
