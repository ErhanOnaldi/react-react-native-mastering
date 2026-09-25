import { describe, expect, it, vi } from 'vitest'
import { server, http, HttpResponse, TMDB_BASE, requests } from '@test-utils'
import { tmdbClient } from '@project/src/shared/api/tmdb-client'
import { movieDetailsSchema } from '@project/src/features/movies/api/schemas'

describe('Sinema doğrulamalı API client', () => {
  it('yetkili TMDB isteğinde film detayını şemayla döndürür', async () => {
    vi.stubEnv('VITE_TMDB_TOKEN', 'test-token')
    const movie = await tmdbClient.get('/movie/550', movieDetailsSchema)
    expect(movie.title).toBe('Dövüş Kulübü')
    expect(requests('/3/movie/550')).toHaveLength(1)
    vi.unstubAllEnvs()
  })
  it('200 içindeki null başlığı veri sınırında reddeder', async () => {
    vi.stubEnv('VITE_TMDB_TOKEN', 'test-token')
    server.use(
      http.get(`${TMDB_BASE}/movie/550`, () => HttpResponse.json({ id: 550, title: null })),
    )
    await expect(tmdbClient.get('/movie/550', movieDetailsSchema)).rejects.toThrow()
    vi.unstubAllEnvs()
  })
  it('HTTP 404 durumunu veri hatasından ayrı tutar', async () => {
    vi.stubEnv('VITE_TMDB_TOKEN', 'test-token')
    await expect(tmdbClient.get('/movie/99999999', movieDetailsSchema)).rejects.toThrow()
    vi.unstubAllEnvs()
  })
})
