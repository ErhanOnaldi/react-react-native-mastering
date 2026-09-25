import { describe, expect, it } from 'vitest'
import { catalog, server, TMDB_BASE } from '@test-utils'
import { makeSearchHandler } from '@exercise/searchHandler'
const movies = catalog.filter((movie) => movie.id === 550 || movie.id === 603)
describe('makeSearchHandler', () => {
  it('query ile eşleşen filmi döndürür', async () => {
    server.use(makeSearchHandler(movies))
    const response = await fetch(`${TMDB_BASE}/search/movie?query=Matrix`, {
      headers: { Authorization: 'Bearer test-token' },
    })
    const data = (await response.json()) as { results: { title: string }[]; total_results: number }
    expect(data.results.map((movie) => movie.title)).toEqual(['Matrix'])
    expect(data.total_results).toBe(1)
  })
  it('boş query için sonuç döndürmez', async () => {
    server.use(makeSearchHandler(movies))
    const response = await fetch(`${TMDB_BASE}/search/movie?query=%20`, {
      headers: { Authorization: 'Bearer test-token' },
    })
    expect(await response.json()).toMatchObject({ results: [], total_results: 0 })
  })
})
