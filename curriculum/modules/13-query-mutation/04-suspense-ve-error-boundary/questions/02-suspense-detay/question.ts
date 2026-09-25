import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Detayı Suspense ile oku',
  difficulty: 'orta',
  concepts: ['query.suspense', 'react.suspense', 'react.error-boundary'],
  files: ['MovieDetail.tsx'],
  hints: [
    'useSuspenseQuery queryKey içinde id olmalı.',
    'queryFn load(id) çağırır.',
    'data tanımlıdır; h1 içinde data.title göster.',
  ],
})
