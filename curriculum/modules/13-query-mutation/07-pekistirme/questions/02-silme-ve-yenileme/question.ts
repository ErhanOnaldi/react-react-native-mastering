import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Silme sonrası listeyi tazele',
  difficulty: 'orta',
  concepts: ['query.invalidation', 'query.useMutation', 'query.keys'],
  files: ['useDeleteRating.ts'],
  hints: [
    'useQueryClient ile client al.',
    'onSuccess içinde sessionId’li rating key’ini invalidate et.',
    'Callback Promise döndürsün.',
  ],
})
