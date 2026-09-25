import { beforeEach, describe, expect, it } from 'vitest'
import {
  getGuestSession,
  rateMovie,
  deleteRating,
} from '@project/src/features/rating/api/rating-api'
import { ratedMoviesQuery } from '@project/src/features/rating/api/rating-queries'
import { QueryClient } from '@tanstack/react-query'
import { requests } from '@test-utils'
beforeEach(() => localStorage.clear())
describe('Sinema puan API’si', () => {
  it('oturumu saklar ve yeniden açmaz', async () => {
    const id = await getGuestSession()
    expect(await getGuestSession()).toBe(id)
    expect(requests('/3/authentication/guest_session/new')).toHaveLength(1)
  })
  it('POST sonrası rated query Dövüş Kulübü puanını okur', async () => {
    const id = await getGuestSession()
    await rateMovie({ movieId: 550, value: 8.5 })
    const data = await new QueryClient().fetchQuery(ratedMoviesQuery(id))
    expect(data.results).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 550, rating: 8.5 })]),
    )
    expect(requests('/3/movie/550/rating').filter((r) => r.method === 'POST')).toHaveLength(1)
  })
  it('DELETE sonrası rated query filmi listeden çıkarır', async () => {
    const id = await getGuestSession()
    await rateMovie({ movieId: 550, value: 8.5 })
    await deleteRating(550)
    const data = await new QueryClient().fetchQuery(ratedMoviesQuery(id))
    expect(data.results.some((movie: { id: number }) => movie.id === 550)).toBe(false)
  })
})
