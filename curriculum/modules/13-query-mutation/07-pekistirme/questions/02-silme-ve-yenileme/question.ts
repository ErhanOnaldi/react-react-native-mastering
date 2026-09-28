import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Silme sonrası listeyi tazele',
  difficulty: 'orta',
  concepts: ['query.invalidation', 'query.useMutation', 'query.keys'],
  files: ['useDeleteRating.ts'],
  hints: [
    'Başarılı ve başarısız DELETE sonrası cache’in farklı davranması gerektiğini ayır.',
    '`useQueryClient` ve mutation callback’lerini kullan.',
    '`onSuccess` içinde `client.invalidateQueries({ queryKey: ["ratings", sessionId] })` döndür.',
    'Invalidation’ı `onError` veya `onSettled` içine koyma; hata eski listeyi korumalı.',
  ],
})
