import { expect, expectTypeOf, it } from 'vitest'
import { isMoviePage } from '@exercise/task'
import type { MoviePage } from '@exercise/task'
it('geçerli sayfayı kabul eder ve unknown tipini daraltır', () => {
  const value: unknown = { page: 1, results: [{ id: 550, title: 'Dövüş Kulübü' }] }
  expect(isMoviePage(value)).toBe(true)
  if (isMoviePage(value)) expectTypeOf(value).toEqualTypeOf<MoviePage>()
})
it('eksik ve bozuk film verisini reddeder', () => {
  expect(isMoviePage({ page: 1 })).toBe(false)
  expect(isMoviePage({ page: 1, results: [{ id: 550 }] })).toBe(false)
  expect(isMoviePage(null)).toBe(false)
  expect(isMoviePage([])).toBe(false)
})
