import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Beklerken favori göster',
  difficulty: 'orta',
  concepts: ['react.useOptimistic', 'react.actions', 'react.events'],
  files: ['OptimisticFavorite.tsx'],
  hints: [
    "Temel favori state'i ile geçici görünen değeri ayır.",
    '`useOptimistic(favorite)` ve async `startTransition` kullan.',
    'Önce `setOptimistic(next)`, sonra `await save(next)`; yalnız başarıda `setFavorite(next)` yap.',
  ],
})
