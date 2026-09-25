import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'project',
  title: 'Oturum, POST/DELETE ve rated query',
  difficulty: 'zor',
  concepts: ['fetch.headers-auth', 'query.query-options', 'query.useMutation'],
  project: 'sinema',
  focusFiles: [
    'src/features/rating/api/rating-api.ts',
    'src/features/rating/api/rating-queries.ts',
  ],
  hints: [
    'Önce getGuestSession ve localStorage tekrar kullanımını kur.',
    'Var olan tmdbClient’in Bearer ve hata davranışını kullanabilirsin.',
    'ratedMoviesQuery için queryOptions({ queryKey, queryFn }) yaz.',
  ],
})
