import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detay cache’i',
  difficulty: 'orta',
  concepts: ['query.useQuery', 'fetch.loading-states', 'test.msw'],
  files: ['MovieDetail.tsx'],
  hints: [
    '`useQuery` sonucundaki `isPending`, `isError`, `data` dallarını sırayla işle.',
    'Key içine `id` koy ve `staleTime` değerini 60_000 yap.',
    'Başarılı dalda `<h2>{movie.data.title}</h2>` döndür.',
  ],
  preview: { entry: 'Preview.tsx' },
})
