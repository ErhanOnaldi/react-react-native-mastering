import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kartta hover prefetch',
  difficulty: 'orta',
  concepts: ['query.prefetch', 'query.query-options', 'react.events'],
  files: ['MovieHover.tsx'],
  timeoutMs: 15000,
  hints: [
    'Kartın hangi olayı kullanıcının detayla ilgilendiğini gösterir?',
    '`useQueryClient()` ile mevcut client’ı al ve pointer event’ine prefetch bağla.',
    '`void client.prefetchQuery(movieQueries.detail(id))`; button name’i `title` prop’u olsun.',
  ],
})
