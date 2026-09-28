import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Bilinen puanı cache’e yaz',
  difficulty: 'orta',
  concepts: ['query.invalidation', 'react.immutability', 'js.array-methods'],
  files: ['patchRating.ts'],
  hints: [
    'Yalnız hangi alanın değiştiğini belirle; diğer kayıtlar aynı kalmalı.',
    '`QueryClient.setQueryData` updater’ında immutable array güncellemesi yap.',
    '`old?.map(...)` ile eşleşen öğeyi `{ ...item, rating: value }` olarak kopyala.',
    'Cache yoksa `undefined` döndür; listede olmayan filmi ekleme.',
  ],
})
