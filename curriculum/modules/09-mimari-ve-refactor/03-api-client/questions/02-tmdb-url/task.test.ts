import { describe, expect, it } from 'vitest'
import { buildTmdbUrl } from '@exercise/buildTmdbUrl'

describe('TMDB URL', () => {
  it('her isteğe Türkçe dil parametresi ekler', () => {
    const url = new URL(buildTmdbUrl('/movie/550'))
    expect(url.pathname).toBe('/3/movie/550')
    expect(url.searchParams.get('language')).toBe('tr-TR')
  })
  it('arama metnindeki boşluk ve Türkçe karakterleri geri okunabilir kodlar', () => {
    const url = new URL(buildTmdbUrl('/search/movie', { query: 'Dövüş Kulübü', page: 2 }))
    expect(url.searchParams.get('query')).toBe('Dövüş Kulübü')
    expect(url.searchParams.get('page')).toBe('2')
  })
  it('undefined filtreyi query string’e yazmaz', () => {
    const url = new URL(buildTmdbUrl('/discover/movie', { with_genres: undefined, page: 3 }))
    expect(url.searchParams.has('with_genres')).toBe(false)
    expect(url.searchParams.get('page')).toBe('3')
  })
})
