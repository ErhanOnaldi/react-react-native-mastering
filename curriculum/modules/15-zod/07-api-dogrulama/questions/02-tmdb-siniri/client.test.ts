import { describe, expect, it } from 'vitest'
import { server, http, HttpResponse, TMDB_BASE, requests } from '@test-utils'
import { getMovie } from '@exercise/client'

describe('TMDB veri sınırı', () => {
  it('yetkili istekle gerçek Türkçe film başlığını döndürür', async () => {
    expect(await getMovie('/movie/550')).toEqual({ id: 550, title: 'Dövüş Kulübü' })
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
  it('200 yanıtındaki null başlığı ekran yerine sınırda reddeder', async () => {
    server.use(
      http.get(`${TMDB_BASE}/movie/550`, () => HttpResponse.json({ id: 550, title: null })),
    )
    await expect(getMovie('/movie/550')).rejects.toThrow()
  })
  it('404 yanıtında HTTP durumunu bildirir', async () => {
    await expect(getMovie('/movie/99999999')).rejects.toThrow(/404/)
  })
})
