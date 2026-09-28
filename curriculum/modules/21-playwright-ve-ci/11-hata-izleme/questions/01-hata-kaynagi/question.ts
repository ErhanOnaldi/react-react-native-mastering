import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi hata hangi kanala düşer?',
  difficulty: 'orta',
  concepts: ['monitoring.error-reporting', 'react.error-boundary'],
  question:
    'Bir bileşen render sırasında hata fırlatıyor ve en yakın Error Boundary hatayı yakalayıp yedek UI gösteriyor. React kökündeki hangi seçenek bu olayı bildirir?',
  options: [
    {
      text: '`onCaughtError`',
      correct: true,
      explanation:
        'Boundary tarafından yakalanan render hataları burada raporlanır; component stack de gelir.',
    },
    {
      text: '`onUncaughtError`',
      correct: false,
      explanation: 'Bu seçenek Boundary tarafından yakalanmayan React hataları içindir.',
    },
    {
      text: '`window` üzerindeki `unhandledrejection`',
      correct: false,
      explanation:
        'Bu olay işlenmemiş Promise reddi içindir; Boundary’nin yakaladığı render hatasının kanalı değildir.',
    },
  ],
})
