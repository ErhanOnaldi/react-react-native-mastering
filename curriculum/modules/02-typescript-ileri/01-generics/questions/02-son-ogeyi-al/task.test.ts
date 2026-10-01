import { expect, expectTypeOf, it } from 'vitest'
import { lastItem } from '@exercise/task'

it('son filmi döndürür ve film tipini korur', () => {
  const movie = lastItem([
    { id: 550, title: 'Dövüş Kulübü' },
    { id: 603, title: 'Matrix' },
  ])

  expect(movie).toEqual({ id: 603, title: 'Matrix' })
  expectTypeOf(movie).toEqualTypeOf<{ id: number; title: string } | undefined>()
  expectTypeOf(movie).not.toBeAny()
})

it('son türü döndürür ve tür tipini korur', () => {
  const genre = lastItem([{ id: 18, name: 'Dram' }])

  expect(genre?.name).toBe('Dram')
  expectTypeOf(genre).toEqualTypeOf<{ id: number; name: string } | undefined>()
})

it('boş listede undefined döndürür', () => {
  expect(lastItem([] as number[])).toBeUndefined()
})
