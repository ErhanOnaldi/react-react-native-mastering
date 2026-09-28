import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'URL’den sorgu kimliği',
  difficulty: 'orta',
  concepts: ['query.keys', 'router.search-params', 'fetch.query-params', 'js.optional-chaining'],
  files: ['searchKey.ts'],
  hints: [
    'URLSearchParams hem metni hem sayıyı string olarak verir; önce ikisini oku.',
    '`params.get`, `Number`, `Number.isInteger` ve pozitiflik kontrolünü kullan.',
    '`return ["movies", "search", query, page] as const` biçiminde tuple üret.',
  ],
})
