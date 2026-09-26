import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'URL ile cache birlikte',
  difficulty: 'orta',
  concepts: ['query.keys', 'router.search-params', 'query.stale-gc'],
  files: ['MovieSearchPage.tsx'],
  preview: { entry: 'Preview.tsx' },
  hints: [
    'Arama metni ve sayfa paylaşılabilir olmalı; sonucun kimliği de bu ikisine bağlı olmalı.',
    'Aynı aramaya kısa süre içinde geri dönüldüğünde sonucun nereden geleceğini düşün: ağdan mı, elde zaten olan veriden mi?',
    '`useSearchParams` ile `q` ve `page`’i URL’de tut; `useQuery`’nin key’ine ikisini de koy ve kısa bir `staleTime` ver.',
  ],
})
