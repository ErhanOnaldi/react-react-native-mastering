import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sorguya göre film döndüren handler',
  difficulty: 'orta',
  concepts: ['test.msw-overrides', 'test.factories', 'fetch.query-params'],
  files: ['searchHandler.ts'],
  hints: [
    'Önce query’yi normalize et, sonra film listesini filtrele ve API envelope’unu kur.',
    '`new URL(request.url)`, `searchParams` ve `toLocaleLowerCase("tr")` kullan.',
    'Query’yi trim et; boşsa `[]` döndür, değilse eşleşenleri bul ve `total_results: results.length` ayarla.',
  ],
})
