import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi araç hangi işi yapar?',
  difficulty: 'kolay',
  concepts: ['tooling.prettier', 'tooling.eslint', 'react.useEffect.deps'],
  question:
    'PR’da bir dosyanın tırnakları farklı, başka dosyada `useEffect` bağımlılığı eksik. Doğru araç eşlemesi hangisi?',
  options: [
    {
      text: 'Prettier tırnakları eşitler; ESLint Hook bağımlılığını işaretler.',
      correct: true,
      explanation: 'Biçim ve kod kuralı ayrı işlerdir.',
    },
    {
      text: 'Prettier her iki sorunu da düzeltir.',
      explanation: 'Prettier effect’in davranışını analiz etmez.',
    },
    {
      text: 'ESLint tırnakları otomatik biçimler; Prettier `id` bağımlılığını bulur.',
      explanation: 'Roller ters: burada Prettier biçim, ESLint Hook kuralı için kullanılır.',
    },
    {
      text: 'TypeScript iki sorunu da `tsc -b` ile çözer.',
      explanation: 'Tip kontrolü biçim tercihlerini ve effect bağımlılığını çözmez.',
    },
  ],
  explanation: '',
})
