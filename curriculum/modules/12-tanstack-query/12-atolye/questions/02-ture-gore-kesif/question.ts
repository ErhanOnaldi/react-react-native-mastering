import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Türe göre keşif',
  difficulty: 'zor',
  concepts: ['query.keys', 'query.pagination', 'router.search-params'],
  files: ['GenreDiscover.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Aksiyon/page 1 ile Komedi/page 1 aynı cevabı mı temsil ediyor? Bu farkı belirle.',
    '`useSearchParams` ile URL değerlerini oku ve ikisini de query key’e taşı.',
    'Tür seçildiğinde search params’ı page 1 ile güncelle; popstate eski birleşimi geri getirsin.',
  ],
})
