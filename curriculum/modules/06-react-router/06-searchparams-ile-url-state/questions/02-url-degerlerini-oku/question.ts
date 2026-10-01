import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'URL değerlerini güvenli oku',
  difficulty: 'kolay',
  concepts: ['router.search-params', 'ts.narrowing', 'js.optional-chaining'],
  files: ['readSearch.ts'],
  hints: [
    '`q`, `page` ve `genre` için eksik değerlerin ne olacağını ayrı ayrı kararlaştır.',
    '`URLSearchParams.get` string veya null verir; sayısal alanları dönüştürüp güvenli integer olarak doğrula.',
    '`q` değerini `trim()` et; page için 1, genre için null varsayılanını dönüş nesnesinde açıkça belirt.',
  ],
})
