import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama hesabını say',
  difficulty: 'orta',
  concepts: ['perf.memo', 'perf.transitions', 'test.mocks', 'react.derived-state'],
  files: ['SearchMetrics.tsx'],
  hints: [
    'Sayaç hangi hesaplamayı etkilememeli? Input ile liste aynı hızda güncellenmek zorunda mı?',
    '`useDeferredValue` ile liste sorgusunu üret, sonucu `useMemo` ile gerçek girdilerine göre sakla.',
    '`useMemo(() => filter(titles, deferred), [titles, deferred, filter])` kullan.',
  ],
})
