import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB film fabrikası',
  difficulty: 'orta',
  concepts: ['test.factories', 'ts.partial', 'ts.api-types'],
  files: ['makeMovie.ts'],
  hints: [
    'Testin önemli kıldığı alanları ve factory’nin her zaman sağlaması gereken alanları ayır.',
    '`Partial<TmdbListMovie>` kullan; tipi `@test-utils` yolundan `import type` ile al.',
    'Fonksiyon içinde yeni varsayılan nesne ve `genre_ids` dizisi oluştur; en sonda `...overrides` uygula.',
  ],
})
