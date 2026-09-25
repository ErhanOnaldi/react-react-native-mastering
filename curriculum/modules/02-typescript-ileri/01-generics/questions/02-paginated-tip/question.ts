import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'Sayfalama kabuğunu birleştir',
  difficulty: 'orta',
  concepts: ['ts.generics', 'ts.arrays-tuples', 'ts.api-types'],
  files: ['task.ts'],
  hints: [
    'Tekrarlanan dört alanı bir generic tipte topla.',
    '`results` alanı `T[]`; iki cevap tipini aynı kabuktan türet.',
    'İlk sonuç için `response.results[0]` kullan; boş diziyi ayrıca düşün.',
  ],
})
