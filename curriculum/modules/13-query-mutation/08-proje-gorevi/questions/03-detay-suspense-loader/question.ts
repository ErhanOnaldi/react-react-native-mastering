import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Detayı Suspense ve loader ile hazırla',
  difficulty: 'zor',
  concepts: ['query.suspense', 'query.router', 'router.error-boundary'],
  project: 'sinema',
  focusFiles: [
    'src/pages/MovieDetailsPage.tsx',
    'src/router.tsx',
    'src/features/movies/api/movie-queries.ts',
  ],
  hints: [
    'Route parametresini Number + Number.isInteger ile doğrula.',
    'Loader ve useSuspenseQuery aynı movieQueries.detail(id) tarifini kullanmalı.',
    'Suspense yüklemeyi, ErrorBoundary hatayı yakalar.',
  ],
})
