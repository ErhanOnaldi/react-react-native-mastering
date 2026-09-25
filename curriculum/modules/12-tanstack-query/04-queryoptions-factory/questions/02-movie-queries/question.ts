import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tipli movieQueries',
  difficulty: 'orta',
  concepts: ['query.query-options', 'query.keys', 'ts.generics', 'arch.api-client'],
  files: ['movieQueries.ts'],
  hints: [
    'Önce iki endpoint için tek Bearer’lı `get<T>` yardımcı fonksiyonu kur.',
    '`queryOptions({queryKey, queryFn, staleTime})` döndüren iki factory yaz.',
    '`detail` key’ine id, `search` key’ine `query.trim()` ve page ekle.',
  ],
})
