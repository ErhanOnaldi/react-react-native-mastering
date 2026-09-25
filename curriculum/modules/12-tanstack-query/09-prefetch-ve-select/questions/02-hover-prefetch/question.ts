import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kartta hover prefetch',
  difficulty: 'orta',
  concepts: ['query.prefetch', 'query.query-options', 'react.events'],
  files: ['MovieHover.tsx'],
  timeoutMs: 15000,
  hints: [
    '`useQueryClient()` ile client’ı al.',
    '`onMouseEnter` olayında `client.prefetchQuery(movieQueries.detail(id))` çağır.',
    'Promise için event handler’da `void` kullan; buton başlığı prop’tan gelsin.',
  ],
})
