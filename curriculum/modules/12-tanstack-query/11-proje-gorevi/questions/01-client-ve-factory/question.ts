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
    'Başlamadan önce API fonksiyonlarının argümanlarını ve döndürdüğü tipleri çıkar.',
    '`QueryClient` ve `queryOptions` helper’larıyla her sorgu için key ve function’ı birlikte kur.',
    '`all` kökünü `["movies"]` yap; detail/search için 60_000 süreyi ve entry dosyasındaki provider’ı ekle.',
  ],
  rubric: [
    '`queryClient` tek uygulama cache’i olarak kurulur ve sağlayıcıyla ağaca verilir.',
    'Altı `movieQueries` tarifi parametreleri key’e taşır ve mevcut API fonksiyonlarını kullanır.',
    'Factory’nin tip çıkarımı `fetchQuery` ve sayfalarda tekrar generic yazmayı gerektirmez.',
  ],
})
