import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Lazy modül sözleşmesi',
  difficulty: 'orta',
  concepts: ['router.lazy', 'js.modules'],
  question:
    '`{ path: "favorites", lazy: () => import("./favorites") }` için modül ne export etmeli?',
  options: [
    {
      text: '`Component` gibi bir route alanı.',
      correct: true,
      explanation: 'Doğru. Data mode lazy modülü route alanlarını çözer.',
    },
    {
      text: 'Yalnızca `default` React bileşeni.',
      explanation: 'Doğrudan default export, lazy route sözleşmesindeki Component alanı değildir.',
    },
    {
      text: '`path` değerini yalnızca lazy modülünde.',
      explanation: 'Router eşleşmeyi import tamamlanmadan yapar; path rota ağacında kalır.',
    },
  ],
})
