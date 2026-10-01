import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useOptimisticRating } from '@exercise/useOptimisticRating'
function setup(rate: (input: { movieId: number; value: number; title: string }) => Promise<void>) {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { client, ...renderHook(() => useOptimisticRating('guest-1', rate), { wrapper }) }
}
describe('optimistic puan', () => {
  it('bekleyen puanı ortak listeye yazar ve verilen rate fonksiyonunu çağırır', async () => {
    let finish!: () => void
    const rate = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve
        }),
    )
    const { client, result } = setup(rate)
    client.setQueryData(['ratings', 'guest-1'], [])
    act(() => result.current.mutate({ movieId: 550, value: 8.5, title: 'Dövüş Kulübü' }))
    await waitFor(() =>
      expect(client.getQueryData(['ratings', 'guest-1'])).toEqual([
        { id: 550, title: 'Dövüş Kulübü', rating: 8.5 },
      ]),
    )
    expect(rate).toHaveBeenCalledWith({ movieId: 550, value: 8.5, title: 'Dövüş Kulübü' })
    finish()
  })
  it('rate reject edince snapshot puanını geri yükler', async () => {
    let fail!: (error: Error) => void
    const rate = () =>
      new Promise<void>((_, reject) => {
        fail = reject
      })
    const { client, result } = setup(rate)
    const old = [{ id: 550, title: 'Dövüş Kulübü', rating: 7 }]
    client.setQueryData(['ratings', 'guest-1'], old)
    act(() => result.current.mutate({ movieId: 550, value: 8.5, title: 'Dövüş Kulübü' }))
    await waitFor(() =>
      expect(client.getQueryData(['ratings', 'guest-1'])).toEqual([
        { id: 550, title: 'Dövüş Kulübü', rating: 8.5 },
      ]),
    )
    fail(new Error('Sunucu hatası'))
    await waitFor(() => expect(client.getQueryData(['ratings', 'guest-1'])).toEqual(old))
  })
})
