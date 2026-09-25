import { beforeEach, describe, expect, it } from 'vitest'
import { getGuestSession, rateMovie } from '@exercise/ratingApi'
import { requests } from '@test-utils'
beforeEach(() => localStorage.clear())
describe('guest session ve puanlama', () => {
  it('oturumu bir kez açıp yeniden kullanır', async () => {
    const first = await getGuestSession()
    expect(first).toMatch(/^guest-/)
    expect(await getGuestSession()).toBe(first)
    expect(requests('/3/authentication/guest_session/new')).toHaveLength(1)
  })
  it('8,5 puanı yetkili POST ile sunucuya yazar', async () => {
    await rateMovie({ movieId: 550, value: 8.5 })
    const id = await getGuestSession()
    const response = await fetch(`https://api.themoviedb.org/3/guest_session/${id}/rated/movies`, {
      headers: { Authorization: 'Bearer test-token' },
    })
    const data = (await response.json()) as { results: Array<{ id: number; rating: number }> }
    expect(data.results).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 550, rating: 8.5 })]),
    )
    expect(requests('/3/movie/550/rating').filter((r) => r.method === 'POST')).toHaveLength(1)
  })
  it('geçersiz yarım adımda POST atmaz', async () => {
    await expect(rateMovie({ movieId: 550, value: 8.3 })).rejects.toThrow()
    expect(requests('/3/movie/550/rating')).toHaveLength(0)
  })
})
