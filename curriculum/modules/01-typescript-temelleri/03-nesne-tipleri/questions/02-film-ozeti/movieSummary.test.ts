import { describe, expect, expectTypeOf, it } from 'vitest'
import { summary } from '@exercise/movieSummary'
import type { MovieSummary } from '@exercise/movieSummary'

describe('MovieSummary', () => {
  it('opsiyonel sloganı başlığa ekler', () => {
    expect(
      summary({ id: 550, title: 'Dövüş Kulübü', poster_path: null, tagline: 'İlk kural' }),
    ).toBe('Dövüş Kulübü — İlk kural')
  })
  it('slogan yoksa yalnızca başlığı döner', () => {
    expect(summary({ id: 550, title: 'Dövüş Kulübü', poster_path: null })).toBe('Dövüş Kulübü')
  })
  it('poster ve slogan tiplerini doğru modeller', () => {
    expectTypeOf<MovieSummary['poster_path']>().toEqualTypeOf<string | null>()
    expectTypeOf<MovieSummary['tagline']>().toEqualTypeOf<string | undefined>()
  })
})
