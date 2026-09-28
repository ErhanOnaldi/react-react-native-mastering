import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Arama hesabını say',
  difficulty: 'orta',
  concepts: ['perf.memo', 'perf.transitions', 'test.mocks', 'react.derived-state'],
  files: ['SearchMetrics.tsx'],
  hints: [
    'Önce gereksiz hesabı hangi state değişiminin tetiklediğini bul; input ve ağır liste aynı öncelikte olmak zorunda değil.',
    'useDeferredValue ile liste sorgusunu ertele, useMemo ile pahalı filtre sonucunu girdilere göre sakla.',
    "Filtrenin girdileri titles, deferred sorgu ve filter fonksiyonudur. Sayaç state'ini bu hesaplamaya bağlama.",
  ],
})
