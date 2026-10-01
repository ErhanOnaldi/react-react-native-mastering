import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Alias neden iki yerde?',
  difficulty: 'kolay',
  concepts: ['tooling.path-alias', 'tooling.tsconfig', 'tooling.vite-config'],
  question: `\
\`@/features/search/components/SearchBox\` TypeScript editöründe hatasız, fakat Vite build'i "failed to resolve import" diyor. \`tsconfig.app.json\` içinde \`paths\` zaten \`./src/*\` hedefini gösteriyor. Hangi parça hâlâ aynı kökü öğrenmeli?`,
  options: [
    {
      text: 'vite.config.ts resolve.alias',
      correct: true,
      explanation:
        'TypeScript editör yolunu buluyor; Vite kendi modül çözümünde aynı src kökünü eşlemeli.',
    },
    {
      text: 'tsconfig.app.json paths',
      explanation: 'Bu ayar editörde zaten çalışıyor; Vite için ayrıca eşleme gerekir.',
    },
    {
      text: 'baseUrl: src',
      explanation: '`baseUrl` Vite resolver ayarı değildir; ayrıca alias eşlemesi gerekir.',
    },
    { text: 'ESLint kuralı', explanation: 'Lint modül çözümünü tarayıcıya öğretmez.' },
  ],
})
