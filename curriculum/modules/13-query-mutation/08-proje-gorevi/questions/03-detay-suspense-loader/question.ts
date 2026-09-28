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
    'URL’den gelen id’nin geçersiz olabileceğini ve geçersizken GET çıkmaması gerektiğini düşün.',
    '`Number.isInteger`, `ensureQueryData`, `useSuspenseQuery`, Suspense ve Error Boundary kullan.',
    'Loader ve sayfaya aynı `movieQueries.detail(id)` tarifini ver; detay route’unun çevresine bekleme ve hata sınırlarını koy.',
  ],
})
