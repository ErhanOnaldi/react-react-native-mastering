import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'URL’den sorgu kimliği',
  difficulty: 'orta',
  concepts: ['query.keys', 'router.search-params', 'fetch.query-params', 'js.optional-chaining'],
  files: ['searchKey.ts'],
  hints: [
    'Önce `params.get` ile iki değeri oku.',
    '`Number.isInteger` ve `raw > 0` ile page’i doğrula.',
    '`return ["movies", "search", query, page] as const` yaz.',
  ],
})
