import { afterEach, describe, expect, it, vi } from 'vitest'
import { tmdbClient } from '@impl/tmdbClient'

afterEach(() => vi.unstubAllGlobals())

describe('tmdbClient.get', () => {
  it('ikinci arama sayfasını Bearer başlığıyla ister ve film cevabını döner', async () => {
    const fakeFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ results: [{ id: 27205, title: 'Başlangıç' }] }))
    vi.stubGlobal('fetch', fakeFetch)
    const result = await tmdbClient.get<{ results: { id: number; title: string }[] }>(
      '/search/movie',
      { query: 'Başlangıç', page: 2 },
    )
    expect(fakeFetch).toHaveBeenCalledTimes(1)
    const [input, init] = fakeFetch.mock.calls[0]
    const url = new URL(String(input))
    expect(url.pathname).toBe('/3/search/movie')
    expect(url.searchParams.get('query')).toBe('Başlangıç')
    expect(url.searchParams.get('page')).toBe('2')
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-token')
    expect(result.results).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 27205, title: 'Başlangıç' })]),
    )
  })
})
