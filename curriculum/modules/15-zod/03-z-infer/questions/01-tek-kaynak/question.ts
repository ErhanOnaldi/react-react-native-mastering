import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Tipin kaynağı',
  difficulty: 'kolay',
  concepts: ['zod.infer', 'ts.inference'],
  question: `Bu şema boş adı çalışma anında reddeder. \`Values['name']\` ve parse sonucu hakkında hangisi doğrudur?

\`\`\`ts
const watchlistSchema = z.object({ name: z.string().min(1), isPublic: z.boolean() })
type Values = z.infer<typeof watchlistSchema>
const result = watchlistSchema.safeParse({ name: '', isPublic: true })
\`\`\``,
  options: [
    {
      text: '`Values["name"]` tipi string, parse sonucu ise başarısızdır.',
      correct: true,
      explanation:
        'Doğru. `z.infer` alanın TypeScript tipini çıkarır; min(1) gibi içerik kuralını çalışma anında parse sınar.',
    },
    {
      text: '`Values["name"]` boş stringi dışlar; parse da bu yüzden başarılıdır.',
      correct: false,
      explanation:
        '`string` tipi boş stringi içerir. `min(1)` yalnız şema parse edildiğinde çalışır; alanın statik tipi daha dar olmaz.',
    },
    {
      text: '`z.infer` tek başına nesneyi kontrol eder, bu nedenle parse çağrısı gerekmez.',
      correct: false,
      explanation: 'Assertion çalışma zamanı kuralını değiştirmez.',
    },
  ],
})
