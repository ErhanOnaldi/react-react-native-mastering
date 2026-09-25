import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { useOptimisticRating } from '@exercise/useOptimisticRating'
function setup() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  return { client, ...renderHook(() => useOptimisticRating('guest-1'), { wrapper }) }
}
describe('optimistic puan', () => {
  it('POST beklerken paylaşılan listeye puanı hemen yazar', async () => {
    let finish!: (response: Response) => void
    server.use(
      http.post(
        `${TMDB_BASE}/movie/:id/rating`,
        () =>
          new Promise<Response>((resolve) => {
            finish = resolve
          }),
      ),
    )
    const { client, result } = setup()
    client.setQueryData(['ratings', 'guest-1'], [])
    act(() => result.current.mutate({ movieId: 550, value: 8.5, title: 'Dövüş Kulübü' }))
    await waitFor(() =>
      expect(client.getQueryData(['ratings', 'guest-1'])).toEqual([
        { id: 550, title: 'Dövüş Kulübü', rating: 8.5 },
      ]),
    )
    await waitFor(() => expect(typeof finish).toBe('function'))
    finish(HttpResponse.json({ success: true }))
  })
  it('sunucu 500 döndürünce snapshot puanını geri yükler', async () => {
    server.use(
      http.post(`${TMDB_BASE}/movie/:id/rating`, () => HttpResponse.json({}, { status: 500 })),
    )
    const { client, result } = setup()
    const old = [{ id: 550, title: 'Dövüş Kulübü', rating: 7 }]
    client.setQueryData(['ratings', 'guest-1'], old)
    act(() => result.current.mutate({ movieId: 550, value: 8.5, title: 'Dövüş Kulübü' }))
    await waitFor(() => expect(requests('/3/movie/550/rating')).toHaveLength(1))
    await waitFor(() => expect(client.getQueryData(['ratings', 'guest-1'])).toEqual(old))
  })
})
