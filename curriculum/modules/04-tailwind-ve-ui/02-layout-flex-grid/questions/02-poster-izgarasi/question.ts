import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Responsive poster ızgarası',
  difficulty: 'orta',
  concepts: ['tailwind.layout', 'tailwind.responsive', 'react.lists-keys'],
  files: ['PosterGrid.tsx'],
  hints: [
    'Section önce dar ekranda iki sütun olsun.',
    '`grid` ve `gap-4` ekle; `sm:` ve `lg:` ile sütun sayısını büyüt.',
    'Section: `grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4`; article: `min-w-0`.',
  ],
  preview: {
    entry: 'Preview.tsx',
  },
})
