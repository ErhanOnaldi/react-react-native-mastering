import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Kartta hover prefetch',
  difficulty: 'orta',
  concepts: ['query.prefetch', 'query.query-options', 'react.events'],
  files: ['MovieHover.tsx'],
  timeoutMs: 15000,
  hints: [
    'Fare işaretçisi button üzerine geldiğinde hangi event çalışır?',
    '`useQueryClient()` ile mevcut client’ı al ve `onMouseEnter` olayında prefetch başlat.',
    '`void client.prefetchQuery(movieQueries.detail(id))`; button name’i `title` prop’u olsun.',
  ],
})
