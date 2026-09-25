import { describe, expect, expectTypeOf, it } from 'vitest'
import { movieTitles } from '@exercise/movieTitles'

describe('movieTitles', () => {
  it('posterli filmlerin başlıklarını sırayla döner', () => {
    expect(
      movieTitles([
        { title: 'Dövüş Kulübü', poster_path: '/x.jpg' },
        { title: 'İsimsiz', poster_path: null },
        { title: 'Başlangıç', poster_path: '/y.jpg' },
      ]),
    ).toEqual(['Dövüş Kulübü', 'Başlangıç'])
  })
  it('boş listede boş dizi döner', () => {
    expect(movieTitles([])).toEqual([])
  })
  it('dönüşün metin dizisi olduğunu korur', () => {
    expectTypeOf(movieTitles).returns.toEqualTypeOf<string[]>()
  })
})
