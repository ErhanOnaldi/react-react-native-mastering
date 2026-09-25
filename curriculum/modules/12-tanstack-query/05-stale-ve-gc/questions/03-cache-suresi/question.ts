import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Cache süresi',
  difficulty: 'orta',
  concepts: ['query.stale-gc', 'query.query-options', 'test.msw'],
  files: ['cachePolicy.ts'],
  hints: [
    'İki süreyi ayrı seçenek olarak yaz.',
    '`queryFn` gerçek TMDB isteği yapmalı; key id içermeli.',
    '`staleTime: 60_000, gcTime: 300_000` ve Bearer’lı fetch kullan.',
  ],
})
