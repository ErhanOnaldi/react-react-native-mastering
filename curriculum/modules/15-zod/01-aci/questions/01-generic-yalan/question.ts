import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Generic sınırda ne yapar?',
  difficulty: 'kolay',
  concepts: ['ts.generics', 'ts.api-types', 'zod.api-validation'],
  question:
    '`getJson<MovieDetails>()` 200 dönen JSON içindeki `title: null` değerini nasıl ele alır?',
  options: [
    {
      text: 'Derlenir; çalışma zamanında null kalır.',
      correct: true,
      explanation: 'Doğru. Generic yalnızca TypeScript’e bir iddia verir; JSON’u parse etmez.',
    },
    {
      text: 'Fetch isteğini reddeder.',
      correct: false,
      explanation: 'Fetch yalnızca HTTP sonucunu bilir; JSON alanlarını generic ile denetlemez.',
    },
    {
      text: 'Null değerini boş stringe çevirir.',
      correct: false,
      explanation: 'Generic dönüşüm yapmaz; dönüşüm için gerçek çalışma zamanı kodu gerekir.',
    },
  ],
})
