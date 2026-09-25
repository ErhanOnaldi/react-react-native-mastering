import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchMovies } from '@impl/searchMovies'

afterEach(() => vi.unstubAllGlobals())
describe('searchMovies', () => {
  it('ikinci sayfayı Türkçe ve yetkili ister, gelen filmi korur', async () => {
    const fakeFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(Response.json({ page: 2, results: [{ id: 550, title: 'Dövüş Kulübü' }] }))
    vi.stubGlobal('fetch', fakeFetch)
    const result = await searchMovies('  dövüş  ', 2)
    expect(fakeFetch).toHaveBeenCalledTimes(1)
    const [input, init] = fakeFetch.mock.calls[0]
    const url = new URL(String(input))
    expect(url.searchParams.get('query')).toBe('dövüş')
    expect(url.searchParams.get('page')).toBe('2')
    expect(url.searchParams.get('language')).toBe('tr-TR')
    expect(new Headers(init?.headers).get('Authorization')).toBe('Bearer test-token')
    expect(result).toMatchObject({ page: 2, results: [{ id: 550, title: 'Dövüş Kulübü' }] })
  })

  it('boş sorguda ağ isteği atmaz', async () => {
    const fakeFetch = vi.fn<typeof fetch>()
    vi.stubGlobal('fetch', fakeFetch)
    expect(await searchMovies('   ', 2)).toEqual({ page: 2, results: [] })
    expect(fakeFetch).not.toHaveBeenCalled()
  })
})
