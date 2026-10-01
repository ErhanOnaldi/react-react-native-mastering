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
      text: 'Uygulama büyüyünce Redux DevTools ve middleware kurallarını otomatik eklemek.',
      correct: false,
      explanation:
        'Zustand küçük bir store sunar; Redux Toolkit’in middleware ve DevTools kurulumunu otomatik devralmaz.',
    },
    {
      text: 'Birçok feature için ortak reducer/action düzenini zorunlu hale getirmek.',
      correct: false,
      explanation:
        'Bu RTK’nin ekip kuralları açısından avantajı olabilir, Zustand’ın küçük uygulamadaki sade başlangıç avantajı değil.',
    },
  ],
})
