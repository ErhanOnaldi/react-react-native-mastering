import { describe, expect, it } from 'vitest'
import { buildTmdbUrl } from '@exercise/buildTmdbUrl'

describe('buildTmdbUrl', () => {
  it('başında eğik çizgi olan path için tek doğru TMDB yolu ve Türkçe dil kurar', () => {
    const url = new URL(buildTmdbUrl('/trending/movie/week'))
    expect(url.origin).toBe('https://api.themoviedb.org')
    expect(url.pathname).toBe('/3/trending/movie/week')
    expect(url.searchParams.get('language')).toBe('tr-TR')
  })
  it('boşluklu arama metnini ve sayıyı URLSearchParams ile taşır', () => {
    const url = new URL(buildTmdbUrl('search/movie', { query: 'Kara Şövalye & Matrix', page: 2 }))
    expect(url.pathname).toBe('/3/search/movie')
    expect(url.searchParams.get('query')).toBe('Kara Şövalye & Matrix')
    expect(url.searchParams.get('page')).toBe('2')
  })
  it('tanımsız değeri URL’ye yazmaz ve açık dil tercihini korur', () => {
    const url = new URL(
      buildTmdbUrl('/discover/movie', { with_genres: 28, page: undefined, language: 'en-US' }),
    )
    expect(url.searchParams.get('with_genres')).toBe('28')
    expect(url.searchParams.has('page')).toBe(false)
    expect(url.searchParams.get('language')).toBe('en-US')
  })
})
