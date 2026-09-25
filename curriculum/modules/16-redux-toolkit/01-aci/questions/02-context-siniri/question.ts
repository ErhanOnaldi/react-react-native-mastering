import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Context sınırı',
  difficulty: 'kolay',
  concepts: ['react.context'],
  question:
    'Beş değeri tek bir `{ favorites, theme, watchlists }` Context değerinde topladın. `favorites` değişince `theme` okuyan tüketici neden etkilenebilir?',
  options: [
    {
      text: 'Provider value nesnesinin referansı değişir; o Context’in tüketicileri yeniden render olur.',
      correct: true,
      explanation: 'Context alan bazında varsayılan abonelik sağlamaz.',
    },
    {
      text: 'theme değişmediği için hiçbir zaman render olmaz.',
      correct: false,
      explanation:
        'Context değeri nesne olarak değişir; alanın aynı kalması tek başına yeterli değildir.',
    },
    {
      text: 'React Redux otomatik devreye girer.',
      correct: false,
      explanation: 'Context kullanırken Redux aboneliği yoktur.',
    },
  ],
})
