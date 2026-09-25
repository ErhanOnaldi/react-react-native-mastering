import { expect, expectTypeOf, it } from 'vitest'
import { describeLoad } from '@exercise/task'
import type { LoadArgs, LoadPromise, LoadedMovie } from '@exercise/task'
it('parametre ve async dönüş tiplerini fonksiyondan türetir', () => {
  expectTypeOf<LoadArgs>().toEqualTypeOf<[id: number, token: string]>()
  expectTypeOf<LoadPromise>().toEqualTypeOf<Promise<{ id: number; title: string }>>()
  expectTypeOf<LoadedMovie>().toEqualTypeOf<{ id: number; title: string }>()
})
it('ilk parametredeki film ID’sini açıklar', () => {
  expect(describeLoad([550, 'test-token'])).toBe('550 için istek')
})
