import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'POST sonrası listeyi yenile',
  difficulty: 'orta',
  concepts: ['query.invalidation', 'query.keys', 'query.useMutation'],
  files: ['useRate.ts'],
  hints: [
    'Yazma sonrası hangi okumanın eski kaldığını ve hangi session’a ait olduğunu belirle.',
    '`useQueryClient` ve `invalidateQueries` ile key ailesini hedefle.',
    '`onSuccess` içinde `return client.invalidateQueries({ queryKey: ["ratings", sessionId] })` kullan.',
    'Promise’i `void` ile atarsan mutation’ın pending süresi refetch’i beklemez.',
  ],
})
