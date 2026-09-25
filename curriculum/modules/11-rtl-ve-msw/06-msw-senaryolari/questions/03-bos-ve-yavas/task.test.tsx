import { describe, expect, it } from 'vitest'
import { server, TMDB_BASE } from '@test-utils'
import { makeEmptySearchHandler } from '@exercise/emptyHandler'
describe('makeEmptySearchHandler', () => {
  it('sayfa numarasını koruyarak boş TMDB listesi döndürür', async () => {
    server.use(makeEmptySearchHandler(1))
    const response = await fetch(`${TMDB_BASE}/search/movie?query=olmayan&page=2`, {
      headers: { Authorization: 'Bearer test-token' },
    })
    expect(await response.json()).toEqual({
      page: 2,
      results: [],
      total_pages: 1,
      total_results: 0,
    })
  })
  it('geçersiz sayfayı 400 ile reddeder', async () => {
    server.use(makeEmptySearchHandler(1))
    const response = await fetch(`${TMDB_BASE}/search/movie?query=Matrix&page=0`, {
      headers: { Authorization: 'Bearer test-token' },
    })
    expect(response.status).toBe(400)
  })
})
