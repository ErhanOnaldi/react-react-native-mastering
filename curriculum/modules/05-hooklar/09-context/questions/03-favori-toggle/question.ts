import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Context içinde favori değiştir',
  difficulty: 'orta',
  concepts: ['react.context', 'react.immutability', 'react.state'],
  files: ['FavoriteToggle.tsx'],
  hints: [
    'İki düğme aynı kaynağı okuduğunda biri değişince diğeri de yeni değeri görür.',
    'Provider içinde id listesini state’te tut; `setIds(old => ...)` ile önceki state’i kullan.',
    'Varsa `filter` ile çıkar; yoksa spread ile ekle.',
    'Her tüketici Context değerini okuyup düğme metnini `ids.includes(id)` üzerinden hesaplar.',
  ],
})
