import { expect, expectTypeOf, it } from 'vitest'
import { replaceById } from '@exercise/task'

it('eşleşen filmi değiştirip diğer filmleri korur', () => {
  const movies = [
    { id: 550, title: 'Dövüş Kulübü' },
    { id: 603, title: 'Matrix' },
  ]
  const originalMovies = [...movies]
  const next = { id: 550, title: 'Dövüş Kulübü: Yeni Kurgu' }

  const replaced = replaceById(movies, next)

  expect(replaced).toEqual([
    { id: 550, title: 'Dövüş Kulübü: Yeni Kurgu' },
    { id: 603, title: 'Matrix' },
  ])
  expect(replaced).not.toBe(movies)
  expect(movies).toEqual(originalMovies)
  expect(replaced[1]).toBe(movies[1])
  expectTypeOf(replaced).toEqualTypeOf<{ id: number; title: string }[]>()
  expectTypeOf(replaced).not.toBeAny()
})

it('eşleşen ID yoksa yeni dizide aynı öğeleri korur', () => {
  const movies = [{ id: 603, title: 'Matrix' }]
  const replaced = replaceById(movies, { id: 550, title: 'Dövüş Kulübü' })

  expect(replaced).toEqual(movies)
  expect(replaced).not.toBe(movies)
  expect(replaced[0]).toBe(movies[0])
})
