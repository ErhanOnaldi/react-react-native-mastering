import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Poster kartını utility’lerle düzenle',
  difficulty: 'orta',
  concepts: ['tailwind.utilities', 'react.props'],
  files: ['PosterTile.tsx'],
  hints: [
    'Kartın içeriği zaten var; eksik olan utility class’lar.',
    'Kök article için sınır, yuvarlama ve boşluk; h2 ile span için ayrı tipografi ekle.',
    'article: `rounded-xl border p-4`, h2: `font-semibold`, span: `text-sm`.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
