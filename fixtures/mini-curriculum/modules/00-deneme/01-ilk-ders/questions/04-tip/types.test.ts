import { describe, expectTypeOf, it } from 'vitest'
import type { Movie, WithoutId } from '@exercise/types'

describe('WithoutId', () => {
  it('id alanını çıkarır', () => {
    expectTypeOf<WithoutId<Movie>>().toEqualTypeOf<{ title: string }>()
  })

  it('diğer alanlara dokunmaz', () => {
    expectTypeOf<WithoutId<Movie>>().toHaveProperty('title')
  })
})
