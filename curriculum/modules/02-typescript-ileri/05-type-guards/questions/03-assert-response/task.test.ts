import { expect, expectTypeOf, it } from 'vitest'
import { assertMoviePage } from '@exercise/task'
import type { MoviePage } from '@exercise/task'
it('geçerli sayfayı kabul eder ve unknown tipini daraltır', () => {
  const value: unknown = { page: 1, results: [{ id: 550, title: 'Dövüş Kulübü' }] }
  expect(() => assertMoviePage(value)).not.toThrow()
  assertMoviePage(value)
  expectTypeOf(value).toEqualTypeOf<MoviePage>()
})
it('eksik ve bozuk film verisini açıklayıcı hatayla reddeder', () => {
  expect(() => assertMoviePage({ page: 1 })).toThrow('Geçersiz film sayfası')
  expect(() => assertMoviePage({ page: 1, results: [{ id: 550 }] })).toThrow('Geçersiz film sayfası')
})
