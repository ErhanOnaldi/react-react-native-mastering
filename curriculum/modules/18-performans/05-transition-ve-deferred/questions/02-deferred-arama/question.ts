import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Güncel input, ertelenen sonuç',
  difficulty: 'orta',
  concepts: ['perf.transitions', 'react.controlled-input', 'react.derived-state'],
  files: ['DeferredSearch.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Inputun bağlı olduğu state ile listenin kullandığı değeri ayır.',
    '`useDeferredValue(query)` sonucuyla filtrele.',
    '`query !== deferredQuery` iken güncelleniyor metnini göster.',
  ],
})
