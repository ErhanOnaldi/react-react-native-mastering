import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Tipli movieQueries',
  difficulty: 'orta',
  concepts: ['query.query-options', 'query.keys', 'ts.generics', 'arch.api-client'],
  files: ['movieQueries.ts'],
  hints: [
    'Önce iki API fonksiyonunun parametre ve dönüş tiplerini eşleştir.',
    '`queryOptions` ile kimlik, fetch function ve tazelik süresini aynı tarifte kur.',
    '`detail(id)` ve `search(query, page)` için TMDB endpoint’ine giden tarifleri döndür.',
    'Generic HTTP helper çalışma zamanı doğrulaması yapmaz; yalnız response tipini taşır.',
  ],
})
