import { expect, expectTypeOf, it } from 'vitest'
import { GENRE_NAMES, genreLabel } from '@exercise/task'
import type { GenreNames } from '@exercise/task'
it('iki türün adını eksiksiz tutar', () => {
  expect(GENRE_NAMES).toEqual({ 18: 'Dram', 53: 'Gerilim' })
  expectTypeOf(GENRE_NAMES).toEqualTypeOf<GenreNames>()
})
it('seçilen türün Türkçe adını döndürür', () => {
  expect(genreLabel(18)).toBe('Dram')
  expect(genreLabel(53)).toBe('Gerilim')
})
