import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sayfalama kabuğunu birleştir',
  difficulty: 'orta',
  concepts: ['ts.generics', 'ts.arrays-tuples', 'ts.api-types'],
  files: ['task.ts'],
  hints: [
    'Yanıtlarda sabit kalan alanları ve öğe tipi değişen alanı ayır.',
    '`Paginated<T>` generic tipini tanımla; `results` alanı `T[]` olsun.',
    '`MovieListResponse` ve `GenreListResponse` tiplerini aynı kabuktan türet; `firstResult` ilk öğeyi döndürsün.',
    'Boş dizide ilk öğe `undefined` olur; dönüş sözleşmende bunu koru.',
  ],
})
