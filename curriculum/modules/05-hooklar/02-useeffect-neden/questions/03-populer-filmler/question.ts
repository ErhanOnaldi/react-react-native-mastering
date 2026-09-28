import { defineQuestion } from '@rm/content/define'
export default defineQuestion({
  type: 'code',
  title: 'Popüler filmleri bir kez çek',
  difficulty: 'orta',
  concepts: ['react.useEffect', 'fetch.headers-auth', 'fetch.loading-states'],
  files: ['PopularTitles.tsx'],
  hints: [
    'Liste de bir dış sistemden geliyor.',
    'Bileşen açıldıktan sonra tek seferlik senkronizasyon için effect kullan.',
    '`/movie/popular` cevabında `results` dizisi var; ilk elemanın `title` alanını state’e yaz.',
    '`useEffect(() => { fetch(...).then(...) }, [])` yeterli; istek seçeneklerinde Bearer başlığı olmalı.',
  ],
})
