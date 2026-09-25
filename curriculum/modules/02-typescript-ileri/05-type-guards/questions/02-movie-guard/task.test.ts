import { expect, expectTypeOf, it } from 'vitest'
import { isMovieBrief } from '@exercise/task'
import type { MovieBrief } from '@exercise/task'
it('geçerli filmi ve null posteri kabul eder', () => {
  const value: unknown = { id: 550, title: 'Dövüş Kulübü', poster_path: null, vote_average: 8.4 }
  expect(isMovieBrief(value)).toBe(true)
  if (isMovieBrief(value)) expectTypeOf(value).toEqualTypeOf<MovieBrief>()
})
it('401 cevabını ve yanlış alanları reddeder', () => {
  expect(isMovieBrief({ status_code: 7, status_message: 'Invalid API key' })).toBe(false)
  expect(isMovieBrief({ id: '550', title: 'Dövüş Kulübü', poster_path: null })).toBe(false)
  expect(isMovieBrief({ id: 550, title: 'Dövüş Kulübü' })).toBe(false)
  expect(isMovieBrief([])).toBe(false)
  expect(isMovieBrief(null)).toBe(false)
})
