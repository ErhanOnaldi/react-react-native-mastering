import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Alias neden iki yerde?',
  difficulty: 'kolay',
  concepts: ['tooling.path-alias', 'tooling.tsconfig', 'tooling.vite-config'],
  question:
    '`@/shared/api/tmdb-client` editörde çözülüyor ama Vite tarayıcıda bulamıyor. Hangi ayar eksik?',
  options: [
    {
      text: 'vite.config.ts resolve.alias',
      correct: true,
      explanation: 'Doğru. tsconfig tip çözümünü, Vite uygulama modüllerini çözer.',
    },
    {
      text: 'tsconfig.app.json paths',
      explanation: 'Editörde çalıştığına göre TypeScript tarafı zaten çözülmüş.',
    },
    {
      text: 'baseUrl: src',
      explanation: 'TypeScript 6’da baseUrl kullanılmamalı; ayrıca Vite çözümünü ayarlamaz.',
    },
    { text: 'ESLint kuralı', explanation: 'Lint modül çözümünü tarayıcıya öğretmez.' },
  ],
})
