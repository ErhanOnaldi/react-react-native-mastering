import { describe, expect, it } from 'vitest'
import { searchKey } from '@exercise/searchKey'
describe('URL arama kimliği', () => {
  it('URLdeki q ve page değerlerini keye taşır', () => {
    expect(searchKey(new URLSearchParams('q=D%C3%B6v%C3%BC%C5%9F&page=2'))).toEqual([
      'movies',
      'search',
      'Dövüş',
      2,
    ])
  })
  it('geçersiz sayfayı bire düzeltir', () => {
    expect(searchKey(new URLSearchParams('q=Matrix&page=-3'))).toEqual([
      'movies',
      'search',
      'Matrix',
      1,
    ])
    expect(searchKey(new URLSearchParams('q=Matrix&page=abc'))).toEqual([
      'movies',
      'search',
      'Matrix',
      1,
    ])
  })
  it('boşluklu aramayı normalize eder', () => {
    expect(searchKey(new URLSearchParams('q=%20Matrix%20'))).toEqual(
      searchKey(new URLSearchParams('q=Matrix')),
    )
  })
})
