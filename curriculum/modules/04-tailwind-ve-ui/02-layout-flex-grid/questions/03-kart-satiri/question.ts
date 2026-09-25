import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kart başlığı ve puan satırı',
  difficulty: 'orta',
  concepts: ['tailwind.layout', 'react.composition'],
  files: ['MovieRow.tsx'],
  hints: [
    'Kartların arasını grid çözdü; bu kez tek kartın iç satırını çöz.',
    'Kökte flex ve iki uç arasında boşluk, başlıkta daralma, puanda sabit genişlik kullan.',
    'Kök: `flex items-center justify-between gap-2`; h2: `min-w-0 truncate`; span: `shrink-0`.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
