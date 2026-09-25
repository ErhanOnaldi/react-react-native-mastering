import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'
import { patchRating } from '@exercise/patchRating'
describe('puan cache’i', () => {
  it('yalnız seçili filmin puanını değiştirir ve eski nesneyi bozmaz', () => {
    const client = new QueryClient()
    const old = [
      { id: 550, title: 'Dövüş Kulübü', rating: 8.5 },
      { id: 155, title: 'Kara Şövalye', rating: 7 },
    ]
    client.setQueryData(['ratings', 'guest-1'], old)
    patchRating(client, 'guest-1', 550, 9)
    expect(client.getQueryData(['ratings', 'guest-1'])).toEqual([
      { id: 550, title: 'Dövüş Kulübü', rating: 9 },
      old[1],
    ])
    expect(old[0].rating).toBe(8.5)
  })
  it('olmayan cache için boş kayıt üretmez', () => {
    const client = new QueryClient()
    patchRating(client, 'guest-1', 550, 9)
    expect(client.getQueryData(['ratings', 'guest-1'])).toBeUndefined()
  })
})
