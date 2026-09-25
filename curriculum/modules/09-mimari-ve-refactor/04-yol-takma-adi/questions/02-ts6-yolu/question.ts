import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'TypeScript 6 paths',
  difficulty: 'orta',
  concepts: ['tooling.path-alias', 'tooling.tsconfig'],
  question:
    'TypeScript 6 için `@/*` alias’ının `src/` köküne işaret eden doğru `paths` değeri hangisi?',
  options: [
    {
      text: '"@/*": ["./src/*"]',
      correct: true,
      explanation: 'Doğru. Yolun göreli öneki doğrudan paths değerinde bulunur.',
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
