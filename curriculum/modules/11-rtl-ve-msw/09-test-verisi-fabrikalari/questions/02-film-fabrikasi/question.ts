import { defineQuestion } from '@rm/content/define'

export default defineQuestion({
  type: 'code',
  title: 'TMDB film fabrikası',
  difficulty: 'orta',
  concepts: ['test.factories', 'ts.partial', 'ts.api-types'],
  files: ['makeMovie.ts'],
  hints: [
    'TmdbListMovie tipini @test-utils içinden import type ile al.',
    'Varsayılan nesneyi fonksiyonun içinde oluştur.',
    'Son sıradaki ...overrides değerleri default’u ezsin.',
  ],
})
