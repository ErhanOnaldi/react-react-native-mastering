import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Görünür film satırları',
  difficulty: 'orta',
  concepts: ['perf.virtualization', 'react.lists-keys'],
  files: ['VirtualMovies.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    "DOM'a `movies.map` ile tüm satırları basmayı bırak.",
    '`useVirtualizer` için count, getScrollElement, estimateSize ve overscan ver.',
    '`getVirtualItems()` üzerinde dön; `getTotalSize()` ve `row.start` ile konumlandır.',
  ],
})
