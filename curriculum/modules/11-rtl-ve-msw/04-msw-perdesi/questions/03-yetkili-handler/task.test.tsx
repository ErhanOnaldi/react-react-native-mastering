import { describe, expect, it } from 'vitest'
import { server, TMDB_BASE } from '@test-utils'
import { filmHandler } from '@exercise/filmHandler'
describe('filmHandler', () => {
  it('Bearer başlığı ve 550 id ile Türkçe film döndürür', async () => {
    server.use(filmHandler)
    const response = await fetch(`${TMDB_BASE}/movie/550`, {
      headers: { Authorization: 'Bearer demo' },
    })
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ id: 550, title: 'Dövüş Kulübü' })
  })
  it('başlıksız istek için 401 döndürür', async () => {
    server.use(filmHandler)
    const response = await fetch(`${TMDB_BASE}/movie/550`)
    expect(response.status).toBe(401)
    expect(await response.json()).toMatchObject({ status_code: 7 })
  })
  it('bilinmeyen film için 404 döndürür', async () => {
    server.use(filmHandler)
    const response = await fetch(`${TMDB_BASE}/movie/987654`, {
      headers: { Authorization: 'Bearer demo' },
    })
    expect(response.status).toBe(404)
    expect(await response.json()).toMatchObject({ status_code: 34 })
  })
})
