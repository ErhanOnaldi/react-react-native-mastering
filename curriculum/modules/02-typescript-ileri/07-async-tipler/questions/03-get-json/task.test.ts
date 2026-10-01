import { expect, expectTypeOf, it } from 'vitest'
import { getJson } from '@exercise/task'

it('JSON metnini Promise ile çözer ve tipi korur', async () => {
  const promise = getJson<{ id: number; title: string }>('{"id":550,"title":"Dövüş Kulübü"}')
  expectTypeOf(promise).toEqualTypeOf<Promise<{ id: number; title: string }>>()
  const movie = await promise
  expect(movie).toEqual({ id: 550, title: 'Dövüş Kulübü' })
})

it('geçersiz JSON için Promise reddedilir', async () => {
  await expect(getJson('not-json')).rejects.toThrow()
})
