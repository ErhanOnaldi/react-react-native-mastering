import { describe, expect, it } from 'vitest'
import { server, TMDB_BASE } from '@test-utils'
import { makeSearchErrorHandler } from '@exercise/errorHandler'
describe('makeSearchErrorHandler', () => {
  it('arama isteğini istenen 503 hatasıyla yanıtlar', async () => {
    server.use(makeSearchErrorHandler(503))
    const response = await fetch(`${TMDB_BASE}/search/movie?query=Matrix`, {
      headers: { Authorization: 'Bearer test-token' },
    })
    expect(response.status).toBe(503)
    expect(await response.json()).toMatchObject({ status_message: 'Arama başarısız' })
  })
  it('başarı status’u ile hata handler’ı kurulmasını engeller', () => {
    expect(() => makeSearchErrorHandler(200)).toThrow(RangeError)
  })
})
