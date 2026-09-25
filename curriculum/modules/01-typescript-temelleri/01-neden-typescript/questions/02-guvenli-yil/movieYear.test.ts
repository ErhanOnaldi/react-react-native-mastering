import { describe, expect, expectTypeOf, it } from 'vitest'
import { movieYear } from '@exercise/movieYear'

describe('movieYear', () => {
  it('dolu tarihten yılı çıkarır', () => {
    expect(movieYear({ release_date: '1999-10-15' })).toBe('1999')
  })
  it('boş tarihte açıklayıcı metin döner', () => {
    expect(movieYear({ release_date: '' })).toBe('Tarih yok')
  })
  it('girdi ve çıktı sözleşmesini korur', () => {
    expectTypeOf(movieYear).toEqualTypeOf<(movie: { release_date: string }) => string>()
  })
})
