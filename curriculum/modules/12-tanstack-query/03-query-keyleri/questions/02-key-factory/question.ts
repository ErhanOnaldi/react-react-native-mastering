import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Film key factory',
  difficulty: 'orta',
  concepts: ['query.keys', 'ts.as-const', 'arch.colocation'],
  files: ['movieKeys.ts'],
  hints: [
    'Bir arama sonucu hangi girdiler yüzünden diğerinden farklı olabilir?',
    '`search(query, page)` içinde `query.trim()` uygula; detay için `id` taşı.',
    'Örneğin `search: (query, page) => ["movies", "search", query.trim(), page] as const`.',
  ],
})
