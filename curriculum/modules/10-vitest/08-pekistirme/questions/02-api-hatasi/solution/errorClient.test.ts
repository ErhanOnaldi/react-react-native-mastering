import { afterEach, describe, expect, it, vi } from 'vitest'
import { getMovie } from '@impl/errorClient'

afterEach(() => vi.unstubAllGlobals())
describe('getMovie', () => {
  it('404 cevabını TMDB hata kodu ve mesajıyla taşır', async () => {
    const fakeFetch = vi
      .fn<typeof fetch>()
      .mockResolvedValue(
        Response.json({ status_code: 34, status_message: 'Film bulunamadı' }, { status: 404 }),
      )
    vi.stubGlobal('fetch', fakeFetch)
    await expect(getMovie(999999)).rejects.toMatchObject({
      status: 404,
      statusCode: 34,
      message: 'Film bulunamadı',
    })
  })
})
