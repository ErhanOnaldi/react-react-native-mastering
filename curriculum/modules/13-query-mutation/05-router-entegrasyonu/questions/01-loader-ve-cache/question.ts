import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'quiz',
  title: 'Loader ile aynı key',
  difficulty: 'kolay',
  concepts: ['query.router', 'query.query-options'],
  question: 'Loader `ensureQueryData(movieQueries.detail(550))` çağırdı. Bileşen ne yapmalı?',
  options: [
    {
      text: 'Aynı options ile `useSuspenseQuery` çağırmalı.',
      correct: true,
      explanation: 'Aynı key cache’i paylaşır ve bileşen canlı güncellemelere abone olur.',
    },
    {
      text: 'Loader verisini kalıcı local state’e kopyalamalı.',
      explanation: 'Böylece query invalidation sonrası state eski kalabilir.',
    },
    {
      text: 'Farklı key ile yeni query açmalı.',
      explanation: 'Farklı key ikinci GET ve iki ayrı cache girdisi üretir.',
    },
  ],
  explanation: 'Loader route öncesi veriyi hazırlar; query hook cache’e abone kalır.',
})
