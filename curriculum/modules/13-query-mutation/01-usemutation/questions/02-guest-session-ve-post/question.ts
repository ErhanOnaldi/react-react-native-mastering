import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Puan isteğini mutation yap',
  difficulty: 'orta',
  concepts: ['query.useMutation'],
  files: ['useRate.ts'],
  hints: [
    'Hook kurulurken istek gitmemeli; isteği başlatan çağrıyı düşün.',
    'TanStack Query’de `useMutation` bir `mutationFn` ile bu işi sarar.',
    '`return useMutation({ mutationFn: rate })` ile hook sonucunu olduğu gibi döndür.',
  ],
})
