import { describe, expect, it } from 'vitest'
import { deleteRating } from '@exercise/deleteRating'
import { requests } from '@test-utils'
describe('puan silme', () => {
  it('geçerli oturum ve Bearer ile DELETE gönderir', async () => {
    const auth = { Authorization: 'Bearer test-token' }
    const session = (
      (await (
        await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
          headers: auth,
        })
      ).json()) as { guest_session_id: string }
    ).guest_session_id
    await fetch(`https://api.themoviedb.org/3/movie/550/rating?guest_session_id=${session}`, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: 8.5 }),
    })
    await deleteRating(550, session)
    expect(requests('/3/movie/550/rating').filter((r) => r.method === 'DELETE')).toHaveLength(1)
    const data = (await (
      await fetch(`https://api.themoviedb.org/3/guest_session/${session}/rated/movies`, {
        headers: auth,
      })
    ).json()) as { results: unknown[] }
    expect(data.results).toHaveLength(0)
  })
  it('geçersiz oturumda 401 hatasını gizlemez', async () => {
    await expect(deleteRating(550, 'yok')).rejects.toThrow()
  })
})
