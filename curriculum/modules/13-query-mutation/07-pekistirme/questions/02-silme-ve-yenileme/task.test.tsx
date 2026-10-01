import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useDeleteRating } from '@exercise/useDeleteRating'
function setup(remove: (id: number) => Promise<void>) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { client, ...renderHook(() => useDeleteRating('guest-1', remove), { wrapper }) }
}
const movies = [
  { id: 550, title: 'Dövüş Kulübü', rating: 8.5 },
  { id: 155, title: 'Kara Şövalye', rating: 7 },
]
it('silme beklerken satırı kaldırır, başarıda yalnız aynı session listesini stale yapar', async () => {
  let finish!: () => void
  const remove = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve
      }),
  )
  const { client, result } = setup(remove)
  client.setQueryData(['ratings', 'guest-1'], movies)
  client.setQueryData(['ratings', 'guest-2'], movies)
  act(() => result.current.mutate(550))
  await waitFor(() => expect(client.getQueryData(['ratings', 'guest-1'])).toEqual([movies[1]]))
  finish()
  await waitFor(() =>
    expect(client.getQueryState(['ratings', 'guest-1'])?.isInvalidated).toBe(true),
  )
  expect(client.getQueryState(['ratings', 'guest-2'])?.isInvalidated).toBe(false)
})
it('silme reddedilince önceki listeyi geri yükler ve geçersiz kılmaz', async () => {
  let fail!: (error: Error) => void
  const remove = () =>
    new Promise<void>((_, reject) => {
      fail = reject
    })
  const { client, result } = setup(remove)
  client.setQueryData(['ratings', 'guest-1'], movies)
  act(() => result.current.mutate(550))
  await waitFor(() => expect(client.getQueryData(['ratings', 'guest-1'])).toEqual([movies[1]]))
  fail(new Error('500'))
  await waitFor(() => expect(client.getQueryData(['ratings', 'guest-1'])).toEqual(movies))
  expect(client.getQueryState(['ratings', 'guest-1'])?.isInvalidated).toBe(false)
})
