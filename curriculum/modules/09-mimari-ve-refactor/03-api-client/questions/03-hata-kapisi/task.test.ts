import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { ApiError, createTmdbClient } from '@exercise/tmdbClient'

describe('tmdb client', () => {
  const client = createTmdbClient('test-token')
  it('Bearer ile film detayını Türkçe çeker', async () => {
    const movie = await client.get<{ title: string }>('/movie/550')
    expect(movie.title).toBe('Dövüş Kulübü')
    expect(requests('/3/movie/550')).toHaveLength(1)
    expect(requests('/3/movie/550')[0].search.get('language')).toBe('tr-TR')
  })
  it('query değerlerini encoded gönderir', async () => {
    const page = await client.get<{ page: number; results: unknown[] }>('/search/movie', {
      query: 'Dövüş',
      page: 1,
    })
    expect(
      page.results.some((movie) => (movie as { title: string }).title === 'Dövüş Kulübü'),
    ).toBe(true)
    expect(requests('/3/search/movie')[0].search.get('query')).toBe('Dövüş')
  })
  it('bulunmayan filmi TMDB kodlu ApiError olarak bildirir', async () => {
    await expect(client.get('/movie/999999')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      statusCode: 34,
    })
    expect(new ApiError(400, 22, 'Yanlış sayfa')).toBeInstanceOf(Error)
  })
})
