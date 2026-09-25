import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Detayı gerektiğinde yükle',
  difficulty: 'orta',
  concepts: ['perf.code-splitting', 'react.suspense', 'router.lazy'],
  files: ['MovieDetails.tsx'],
  hints: [
    'Büyük paneli başlangıç importundan ayır.',
    '`lazy(() => import(...))` ile yükle ve Suspense sınırı kur.',
    "`const CastPanel = lazy(() => import('./CastPanel'))` tanımını modül üstüne koy.",
  ],
})
