import { describe, expect, it } from 'vitest'
import { readSearch } from '@exercise/readSearch'

describe('URL arama değerleri', () => {
  it('paylaşılan adresin üç değerini okur', () =>
    expect(readSearch(new URLSearchParams('q=Matrix&page=3&genre=28'))).toEqual({
      q: 'Matrix',
      page: 3,
      genre: 28,
    }))
  it('eksik değerlerde güvenli varsayılanlar üretir', () =>
    expect(readSearch(new URLSearchParams())).toEqual({ q: '', page: 1, genre: null }))
  it('bozuk sayfa ve tür değerlerini reddeder', () =>
    expect(
      readSearch(new URLSearchParams('q=%20D%C3%B6v%C3%BC%C5%9F%20&page=0&genre=abc')),
    ).toEqual({ q: 'Dövüş', page: 1, genre: null }))
  it('ondalıklı sayfayı kabul etmez', () =>
    expect(readSearch(new URLSearchParams('page=2.5'))).toEqual({ q: '', page: 1, genre: null }))
})
