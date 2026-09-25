import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Zustand karşılaştırması',
  difficulty: 'kolay',
  concepts: ['redux.store'],
  question:
    'Küçük bir uygulamada az sayıda ortak client değer var. Zustand’ın olası avantajı nedir?',
  options: [
    {
      text: 'Daha az kurulumla küçük client state’i yönetmek.',
      correct: true,
      explanation: 'Daha sade API küçük yüzeylerde yararlı olabilir.',
    },
    {
      text: 'TMDB için otomatik TanStack Query invalidation sağlamak.',
      correct: false,
      explanation: 'Zustand sunucu cache invalidation aracı değildir.',
    },
    {
      text: 'Redux reducer testlerini imkânsız kılmak.',
      correct: false,
      explanation: 'Araç seçimi diğer kütüphanenin test kabiliyetini yok etmez.',
    },
  ],
})
