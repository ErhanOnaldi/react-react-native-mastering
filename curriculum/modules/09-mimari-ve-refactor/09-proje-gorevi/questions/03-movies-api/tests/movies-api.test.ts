import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import {
  discoverMovies,
  getGenres,
  getMovieDetails,
  getTrendingMovies,
  searchMovies,
} from '@project/src/features/movies/api/movies-api'

describe('Sinema film API fonksiyonları', () => {
  it('trend filmleri istenen sayfada getirir', async () => {
    const page = await getTrendingMovies(2)
    expect(page.page).toBe(2)
    expect(requests('/3/trending/movie/week')[0].search.get('page')).toBe('2')
  })

  it('tür filtresini ve sayfayı TMDB parametrelerine çevirir', async () => {
    const page = await discoverMovies({ genreId: 28, page: 1 })
    expect(page.results.length).toBeGreaterThan(0)
    expect(requests('/3/discover/movie')[0].search.get('with_genres')).toBe('28')
    expect(requests('/3/discover/movie')[0].search.get('page')).toBe('1')
  })

  it('Türkçe aramada filmi bulur', async () => {
    const page = await searchMovies({ query: 'Dövüş', page: 1 })
    expect(page.results.some((movie) => movie.title === 'Dövüş Kulübü')).toBe(true)
    expect(requests('/3/search/movie')[0].search.get('query')).toBe('Dövüş')
  })

  it('detayda kadro ve videoları tek istekte getirir', async () => {
    const movie = await getMovieDetails(550)
    expect(movie.title).toBe('Dövüş Kulübü')
    expect(movie.credits?.cast.length).toBeGreaterThan(0)
    expect(requests('/3/movie/550')).toHaveLength(1)
    expect(requests('/3/movie/550')[0].search.get('append_to_response')).toBe('credits,videos')
  })

  it('tür adlarını Türkçe getirir', async () => {
    const response = await getGenres()
    expect(response.genres.some((genre) => genre.name === 'Aksiyon')).toBe(true)
    expect(requests('/3/genre/movie/list')).toHaveLength(1)
  })
})
