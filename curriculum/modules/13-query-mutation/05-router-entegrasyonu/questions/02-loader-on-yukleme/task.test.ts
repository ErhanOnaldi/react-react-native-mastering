import { QueryClient } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { makeDetailLoader } from '@exercise/detailLoader'
describe('detay loader', () => {
  it('filmi route öncesinde bir kez getirip cache’den tekrar kullanır', async () => {
    const client = new QueryClient()
    const load = vi.fn(async (id: number) => ({ id, title: 'Dövüş Kulübü' }))
    const loader = makeDetailLoader(client, load)
    expect(await loader({ params: { id: '550' } })).toEqual({ id: 550, title: 'Dövüş Kulübü' })
    expect(await loader({ params: { id: '550' } })).toEqual({ id: 550, title: 'Dövüş Kulübü' })
    expect(load).toHaveBeenCalledTimes(1)
    expect(client.getQueryData(['movie', 550])).toEqual({ id: 550, title: 'Dövüş Kulübü' })
  })
  it('geçersiz id ile GET başlatmaz', async () => {
    const load = vi.fn(async (id: number) => ({ id, title: '' }))
    const loader = makeDetailLoader(new QueryClient(), load)
    await expect(loader({ params: { id: 'abc' } })).rejects.toThrow()
    expect(load).not.toHaveBeenCalled()
  })
})
