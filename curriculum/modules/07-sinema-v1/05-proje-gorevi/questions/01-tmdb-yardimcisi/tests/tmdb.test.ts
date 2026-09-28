import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { TMDB_BASE_URL, tmdbFetch } from '@project/src/lib/tmdb'
import type { MovieDetails } from '@project/src/types/tmdb'

describe('TMDB yardımcısı', () => {
  it('Bearer token ve Türkçe dil ile detay cevabını getirir', async () => {
    expect(TMDB_BASE_URL).toBe('https://api.themoviedb.org/3')
    const movie = await tmdbFetch<MovieDetails>('/movie/550', {
      append_to_response: 'credits,videos',
    })
    expect(movie.title).toBe('Dövüş Kulübü')
    expect(movie.credits?.cast.some((person) => person.name === 'Brad Pitt')).toBe(true)
    expect(requests('/3/movie/550')[0]?.search.get('language')).toBe('tr-TR')
    expect(requests('/3/movie/550')[0]?.search.get('append_to_response')).toBe('credits,videos')
  })
  it('bulunamayan filmde başarılı veri yerine hata fırlatır', async () => {
    await expect(tmdbFetch('/movie/999999')).rejects.toThrow()
  })
})
