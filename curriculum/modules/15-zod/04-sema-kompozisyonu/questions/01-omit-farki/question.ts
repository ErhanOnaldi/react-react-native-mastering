import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Omit merdiveni',
  difficulty: 'kolay',
  concepts: ['zod.schema-composition', 'ts.omit'],
  question: `İki ifade aynı alanı mı değiştirir?

\`\`\`ts
type Draft = Omit<Watchlist, 'id'>
const draftSchema = watchlistSchema.omit({ id: true })
\`\`\`

Bir ham nesneyi parse ederken hangisini kullanırsın?`,
  options: [
    {
      text: 'İlki yalnız TypeScript tipini, ikincisi parse edilebilir yeni şemayı üretir.',
      correct: true,
      explanation:
        'Doğru. `Draft` derleme sırasında kullanılır; gerçek girdiyi sınamak için `draftSchema.parse(raw)` gerekir.',
    },
    {
      text: 'İkisi de ham nesneden id alanını siler ve yeni nesne döndürür.',
      correct: false,
      explanation: 'Zod `.omit()` parse davranışı olan yeni şema döndürür.',
    },
    {
      text: 'İkisi de çalışma anında doğrulama yapar, yalnızca çıktıları farklı adlandırır.',
      correct: false,
      explanation: 'Her ikisi de tanım türetir; mevcut nesneyi değiştirmez.',
    },
  ],
})
