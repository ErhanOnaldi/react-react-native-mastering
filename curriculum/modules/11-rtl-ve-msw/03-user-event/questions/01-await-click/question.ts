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
      text: 'Yalnız click handler Promise döndürüyorsa await gerekir',
      explanation:
        'Beklenen şey handler’ın işi değil; user-event’in tıklama etkileşimini tamamlamasıdır.',
    },
    {
      text: 'await, React state güncellemesini test dışına taşımak için gerekir',
      explanation:
        'Etkileşimi beklemek gerekir; React güncellemeleri RTL ve user-event akışında ele alınır.',
    },
  ],
})
