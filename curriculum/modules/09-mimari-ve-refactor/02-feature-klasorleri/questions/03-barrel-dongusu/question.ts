import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Barrel sınırı nereye konur?',
  difficulty: 'orta',
  concepts: ['arch.barrel-files', 'arch.feature-folders'],
  question: `\
\`features/movies/index.ts\` \`MovieCard\` ve \`useMovies\` export ediyor. \`MovieCard.tsx\` de aynı barrel'dan \`formatTitle\` import ediyor. Bir testte \`MovieCard\` açılırken \`formatTitle\` undefined oluyor. En küçük, bağımlılık yönünü koruyan düzeltme hangisi?`,
  options: [
    {
      text: 'MovieCard doğrudan `./formatTitle` import eder; `index.ts` dış tüketiciler için kalır.',
      correct: true,
      explanation:
        'Barrel feature dosyalarını tekrar export eder; içeride ona geri dönmek döngü yaratabilir. Doğrudan import bu bağı kaldırır.',
    },
    {
      text: 'Barrel’a `formatTitle` exportunu en üste alıp iç importu aynı bırakır.',
      correct: false,
      explanation:
        'Export sırasını değiştirmek barrel ile dosya arasındaki karşılıklı bağı kaldırmaz.',
    },
    {
      text: 'MovieCard içinden `index.ts` yerine `useMovies` import etmek yeterlidir.',
      correct: false,
      explanation: 'Import edilen yardımcı yine aynı barrel üzerinden gelir; döngü sürer.',
    },
  ],
})
