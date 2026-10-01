import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Poster neden reddedildi?',
  difficulty: 'kolay',
  concepts: ['zod.schemas', 'ts.optional-nullable'],
  question: `Aşağıdaki iki parse sonucundan hangisi başarılı olur?

\`\`\`ts
const posterSchema = z.object({ path: z.string() })
posterSchema.safeParse({ path: null })
posterSchema.safeParse({})
\`\`\`

Şema bu haliyle kalırken hangi sonuçları beklersin?`,
  options: [
    {
      text: 'İkisi de başarısız olur; ilkinde null türü, ikincisinde zorunlu alan eksiktir.',
      correct: true,
      explanation:
        'Doğru. `z.string()` null kabul etmez ve nesne şemasındaki alan varsayılan olarak zorunludur.',
    },
    {
      text: 'İlki başarılı, ikincisi başarısız; Zod null-ı boş metne dönüştürür.',
      correct: false,
      explanation: 'Zod varsayılan olarak dönüştürmez; bunu açıkça istemelisin.',
    },
    {
      text: 'İlki başarısız, ikincisi başarılı; string alan optional olduğu için null kabul edilmez ama eksik olabilir.',
      correct: false,
      explanation: 'Optional eksik/undefined değeri kabul eder; null için nullable gerekir.',
    },
  ],
})
