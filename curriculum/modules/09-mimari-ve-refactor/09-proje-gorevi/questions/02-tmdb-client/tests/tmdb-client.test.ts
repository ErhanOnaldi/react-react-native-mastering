import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { ApiError, tmdbClient } from '@project/src/shared/api/tmdb-client'

describe('Sinema TMDB client', () => {
  it('Bearer ile Türkçe film detayını bir kez çeker', async () => {
    const movie = await tmdbClient.get<{ title: string }>('/movie/550')
    expect(movie.title).toBe('Dövüş Kulübü')
    expect(requests('/3/movie/550')).toHaveLength(1)
    expect(requests('/3/movie/550')[0].search.get('language')).toBe('tr-TR')
  })

  it('arama parametresinde Türkçe karakteri korur', async () => {
    await tmdbClient.get('/search/movie', { query: 'Dövüş Kulübü', page: 1, unused: undefined })
    const request = requests('/3/search/movie')[0]
    expect(request.search.get('query')).toBe('Dövüş Kulübü')
    expect(request.search.get('page')).toBe('1')
    expect(request.search.has('unused')).toBe(false)
  })

  it('bulunmayan film için TMDB kodlu ApiError fırlatır', async () => {
    await expect(tmdbClient.get('/movie/999999')).rejects.toMatchObject({
      status: 404,
      statusCode: 34,
      name: 'ApiError',
    })
    expect(new ApiError(404, 34, 'Film yok')).toBeInstanceOf(Error)
  })
})
