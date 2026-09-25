import { expect, expectTypeOf, it } from 'vitest'
import { applyDraftPatch } from '@exercise/task'
import type { Movie, MovieDraft, MovieDraftPatch } from '@exercise/task'
it('taslak sunucunun atadığı alanları dışarıda bırakır', () => {
  expectTypeOf<MovieDraft>().toEqualTypeOf<Omit<Movie, 'id' | 'vote_average' | 'vote_count'>>()
  expectTypeOf<MovieDraftPatch>().toEqualTypeOf<Partial<MovieDraft>>()
})
it('yalnız verilen alanı günceller ve girdiyi değiştirmez', () => {
  const draft = { title: 'Dövüş Kulübü', overview: 'Eski özet', poster_path: '/old.jpg' }
  const next = applyDraftPatch(draft, { overview: 'Yeni özet', poster_path: null })
  expect(next).toEqual({ title: 'Dövüş Kulübü', overview: 'Yeni özet', poster_path: null })
  expect(draft.poster_path).toBe('/old.jpg')
  expect(next).not.toBe(draft)
})
