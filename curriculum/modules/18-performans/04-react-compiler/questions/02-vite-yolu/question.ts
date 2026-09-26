import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'quiz',
  title: 'Hangi kurulum kararlı?',
  difficulty: 'kolay',
  concepts: ['perf.compiler', 'tooling.vite'],
  question:
    'Bu depoda @vitejs/plugin-react 6 ile React Compiler için hangi yol kararlı varsayılandır?',
  options: [
    {
      text: 'react() + @rolldown/plugin-babel + reactCompilerPreset()',
      correct: true,
      explanation: 'Araştırma notundaki kararlı Babel yolu budur.',
    },
    {
      text: 'react({ compiler: true }) her ortamda kararlı',
      correct: false,
      explanation: 'Native Oxc desteği deneysel etiketlidir.',
    },
    {
      text: 'Yalnız tsconfig strict açmak yeterli',
      correct: false,
      explanation: 'TypeScript tip kontrolü React Compiler dönüşümü yapmaz.',
    },
  ],
})
