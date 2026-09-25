import { describe, expect, expectTypeOf, it } from 'vitest'
import { readMovieTitle } from '@exercise/readMovieTitle'

describe('readMovieTitle', () => {
  it('geçerli film başlığını döndürür', () => { expect(readMovieTitle({ title: 'Başlangıç' })).toBe('Başlangıç') })
  it('API hata gövdesinde null döner', () => { expect(readMovieTitle({ status_code: 7 })).toBeNull() })
  it('yanlış başlık tipini reddeder', () => { expect(readMovieTitle({ title: 123 })).toBeNull() })
  it('bilinmeyen değer alıp nullable metin döndürür', () => { expectTypeOf(readMovieTitle).toEqualTypeOf<(raw: unknown) => string | null>() })
})
