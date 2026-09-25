import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama hesabını say',
  difficulty: 'orta',
  concepts: ['perf.memo', 'perf.transitions', 'test.mocks', 'react.derived-state'],
  files: ['SearchMetrics.tsx'],
  hints: [
    'Sayaç hangi hesaplamayı etkilememeli?',
    'Deferred sorguyu üret, filtre sonucunu girdilerine göre memoize et.',
    '`useMemo(() => filter(titles, deferred), [titles, deferred, filter])` kullan.',
  ],
})
