import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, tmdbClient } from './tmdb-client'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('TMDB client', () => {
  it('ikinci arama sayfasını Türkçe ve Bearer başlığıyla ister', async () => {
    const fake = vi.fn()
    fake.mockResolvedValue(
      Response.json({ results: [{ id: 550, title: 'Dövüş Kulübü' }] }),
    )
    vi.stubGlobal('fetch', fake)

    const result = await tmdbClient.get<{
      results: { id: number; title: string }[]
    }>('/search/movie', { query: 'Dövüş', page: 2 })

    expect(fake).toHaveBeenCalledTimes(1)
    const [input, init] = fake.mock.calls[0]
    const url = new URL(String(input))
    expect(url.pathname).toBe('/3/search/movie')
    expect(url.searchParams.get('language')).toBe('tr-TR')
    expect(url.searchParams.get('query')).toBe('Dövüş')
    expect(url.searchParams.get('page')).toBe('2')
    expect(new Headers(init?.headers).get('Authorization')).toMatch(
      /^Bearer\s+\S+$/,
    )
    expect(result.results).toEqual([{ id: 550, title: 'Dövüş Kulübü' }])
  })

  it('TMDB 404 hatasını ApiError alanlarıyla taşır', async () => {
    const fake = vi.fn()
    fake.mockResolvedValue(
      Response.json(
        { status_code: 34, status_message: 'Film bulunamadı' },
        { status: 404 },
      ),
    )
    vi.stubGlobal('fetch', fake)

    await expect(tmdbClient.get('/movie/999999')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
      statusCode: 34,
      message: 'Film bulunamadı',
    } satisfies Partial<ApiError>)
  })
})
