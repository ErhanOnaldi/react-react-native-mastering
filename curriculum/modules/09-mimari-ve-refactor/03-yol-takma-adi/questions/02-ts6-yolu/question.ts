import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'TypeScript 6 paths',
  difficulty: 'orta',
  concepts: ['tooling.path-alias', 'tooling.tsconfig'],
  question: `\
\`tsconfig.app.json\` repo kökünde duruyor. \`src/features/search/SearchPage.tsx\` dosyasını \`@/features/search/SearchPage\` adıyla bulmak istiyorsun. TypeScript 6 \`paths\` eşlemesi hangisidir?`,
  options: [
    {
      text: '"@/*": ["./src/*"]',
      correct: true,
      explanation: 'Wildcard eşleşmesi config dosyasına göre `./src/*` hedefine eklenir.',
    },
    {
      text: '"@/*": ["*"] ve baseUrl: "src"',
      explanation: 'Bu eski kalıp baseUrl’a dayanır; TS 6’da baseUrl deprecated.',
    },
    {
      text: '"@/*": ["../src"]',
      explanation: 'Yıldız segmenti kaybolur ve yol tsconfig konumuna göre yanlış çözülür.',
    },
    { text: '"@/": ["./src/"]', explanation: 'İç içe dosyalar için wildcard eşleşmesi gerekir.' },
  ],
})
