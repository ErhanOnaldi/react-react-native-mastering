import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Omit merdiveni',
  difficulty: 'kolay',
  concepts: ['zod.schema-composition', 'ts.omit'],
  question:
    '`Omit<Watchlist, "id">` ile `watchlistSchema.omit({ id: true })` arasındaki fark nedir?',
  options: [
    {
      text: 'İlki tip, ikincisi çalışma zamanı şeması üretir.',
      correct: true,
      explanation: 'Doğru. İkisini gerektiği sınırda birlikte kullanabilirsin.',
    },
    {
      text: 'İkisi de yalnızca TypeScript tipidir.',
      correct: false,
      explanation: 'Zod `.omit()` parse davranışı olan yeni şema döndürür.',
    },
    {
      text: 'İkisi de orijinal nesneyi mutasyona uğratır.',
      correct: false,
      explanation: 'Her ikisi de tanım türetir; mevcut nesneyi değiştirmez.',
    },
  ],
})
