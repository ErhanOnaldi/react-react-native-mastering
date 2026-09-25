import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Poster neden reddedildi?',
  difficulty: 'kolay',
  concepts: ['zod.schemas', 'ts.optional-nullable'],
  question: 'TMDB `poster_path: null` gönderdi. `z.string()` kullanan şema ne yapar?',
  options: [
    {
      text: 'Parse başarısız olur; `.nullable()` gerekir.',
      correct: true,
      explanation: 'Doğru. null ayrı bir değerdir; string şeması onu kabul etmez.',
    },
    {
      text: 'Null otomatik boş string olur.',
      correct: false,
      explanation: 'Zod varsayılan olarak dönüştürmez; bunu açıkça istemelisin.',
    },
    {
      text: '`.optional()` null kabul eder.',
      correct: false,
      explanation: 'Optional eksik/undefined değeri kabul eder; null için nullable gerekir.',
    },
  ],
})
