import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Cache süresi',
  difficulty: 'orta',
  concepts: ['query.stale-gc', 'query.query-options', 'test.msw'],
  files: ['cachePolicy.ts'],
  hints: [
    'Tazeliği ve son abone ayrıldıktan sonraki bellek ömrünü birbirinden ayır.',
    'Query options factory’de `staleTime` ve `gcTime` tanımla; key’e film id’sini ekle.',
    '`queryOptions({ queryKey: [..., id], queryFn: ..., staleTime: 60_000, gcTime: 300_000 })` döndür.',
  ],
})
