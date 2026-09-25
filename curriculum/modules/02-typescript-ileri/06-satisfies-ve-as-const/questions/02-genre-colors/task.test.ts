import { expect, expectTypeOf, it } from 'vitest'
import { GENRE_COLORS, colorFor } from '@exercise/task'
import type { GenreId } from '@exercise/task'
it('tüm türler için renk döndürür', () => {
  expect(colorFor(18)).toBe('indigo')
  expect(colorFor(53)).toBe('rose')
  expect(colorFor(35)).toBe('amber')
})
it('literal ID ve renk tiplerini korur', () => {
  expectTypeOf<GenreId>().toEqualTypeOf<18 | 53 | 35>()
  expectTypeOf(GENRE_COLORS[18]).toEqualTypeOf<'indigo'>()
})
