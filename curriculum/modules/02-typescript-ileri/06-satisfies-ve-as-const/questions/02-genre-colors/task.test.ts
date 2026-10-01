import { expect, expectTypeOf, it } from 'vitest'
import { GENRE_COLORS, ROUTES, colorFor, routeFor } from '@exercise/task'
import type { GenreId } from '@exercise/task'
it('tüm türler için renk döndürür', () => {
  expect(colorFor(18)).toBe('indigo')
  expect(colorFor(53)).toBe('rose')
  expect(colorFor(35)).toBe('amber')
})
it('literal ID ve renk tiplerini korur', () => {
  expectTypeOf<GenreId>().toEqualTypeOf<18 | 53 | 35>()
  expectTypeOf<keyof typeof GENRE_COLORS>().toEqualTypeOf<GenreId>()
  expectTypeOf(GENRE_COLORS[18]).toEqualTypeOf<'indigo'>()
})

it('route tablosunda da literal yolu korur ve seçilen yolu verir', () => {
  expectTypeOf<keyof typeof ROUTES>().toEqualTypeOf<'home' | 'details'>()
  expectTypeOf(ROUTES.details).toEqualTypeOf<'/movie/:id'>()
  expect(routeFor('home')).toBe('/')
  expect(routeFor('details')).toBe('/movie/:id')
})
