import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'POST sonrası listeyi yenile',
  difficulty: 'orta',
  concepts: ['query.invalidation', 'query.keys', 'query.useMutation'],
  files: ['useRate.ts'],
  hints: [
    '`useQueryClient()` ile mevcut cache’e eriş.',
    '`onSuccess` içinde invalidateQueries({ queryKey: ["ratings", sessionId] }) çağır.',
    'Callback’te Promise’i return et; `void` ile atma.',
  ],
})
