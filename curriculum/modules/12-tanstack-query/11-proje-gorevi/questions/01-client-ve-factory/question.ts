import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'project',
  title: 'QueryClient ve movieQueries',
  difficulty: 'zor',
  concepts: ['query.query-options', 'query.keys', 'arch.api-client', 'ts.generics'],
  project: 'sinema',
  focusFiles: [
    'src/shared/api/query-client.ts',
    'src/features/movies/api/movie-queries.ts',
    'src/main.tsx',
  ],
  hints: [
    'Önce `movies-api.ts` imzalarını oku; yeni fetch yazma.',
    '`queryOptions({ queryKey: [...], queryFn: () => getMovieDetails(id), staleTime: 60_000 })` biçimiyle başla.',
    '`all` kök key’i ile alt aileleri kur; `main.tsx` içinde tek QueryClientProvider kullan.',
  ],
  rubric: [
    '`queryClient` tek uygulama cache’i olarak kurulur ve sağlayıcıyla ağaca verilir.',
    'Altı `movieQueries` tarifi parametreleri key’e taşır ve mevcut API fonksiyonlarını kullanır.',
    'Factory’nin tip çıkarımı `fetchQuery` ve sayfalarda tekrar generic yazmayı gerektirmez.',
  ],
})
