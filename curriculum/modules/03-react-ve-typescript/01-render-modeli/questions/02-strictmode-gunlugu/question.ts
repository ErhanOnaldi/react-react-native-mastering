import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'StrictMode günlüğü',
  difficulty: 'orta',
  concepts: ['react.strict-mode'],
  question:
    'Geliştirmede StrictMode içindeki saf bileşen render sırasında iki kez log yazabiliyor. Bu neyi kanıtlar?',
  options: [
    {
      text: 'Geliştirme kontrolü render’ı tekrar deneyebilir.',
      correct: true,
      explanation:
        'StrictMode bazı fonksiyonları fazladan çağırarak saflık sorunlarını açığa çıkarır.',
    },
    {
      text: 'Kullanıcı iki kez tıklamıştır.',
      correct: false,
      explanation: 'Render günlüğü bir event handler çağrısı sayacı değildir.',
    },
    {
      text: 'Production her bileşeni iki kez DOM’a ekler.',
      correct: false,
      explanation: 'Geliştirme kontrolünden production DOM davranışı çıkarılmaz.',
    },
  ],
})
