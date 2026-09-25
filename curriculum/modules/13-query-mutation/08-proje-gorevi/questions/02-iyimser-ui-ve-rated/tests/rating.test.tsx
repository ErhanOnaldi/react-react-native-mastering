import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { RatingStars } from '@project/src/features/rating/components/RatingStars'
import { useRateMovie } from '@project/src/features/rating/hooks/useRateMovie'
import { ratedMoviesQuery } from '@project/src/features/rating/api/rating-queries'
import { getGuestSession, rateMovie } from '@project/src/features/rating/api/rating-api'
import RatedPage from '@project/src/pages/RatedPage'
import { routes } from '@project/src/router'
import { MemoryRouter } from 'react-router'
import { renderHook, act, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { http, HttpResponse, server, TMDB_BASE } from '@test-utils'
describe('Sinema optimistic puan', () => {
  it('/rated route’unu sunar ve kayıtlı filmi listeler', async () => {
    localStorage.clear()
    const id = await getGuestSession()
    await rateMovie({ movieId: 550, value: 8.5 })
    const hasRatedRoute = (items: typeof routes): boolean =>
      items.some(
        (route) =>
          route.path === '/rated' ||
          route.path === 'rated' ||
          Boolean(route.children && hasRatedRoute(route.children)),
      )
    expect(hasRatedRoute(routes)).toBe(true)
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    client.setQueryData(
      ratedMoviesQuery(id).queryKey,
      await client.fetchQuery(ratedMoviesQuery(id)),
    )
    render(
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <RatedPage />
        </MemoryRouter>
      </QueryClientProvider>,
    )
    expect(await screen.findByText('Dövüş Kulübü')).toBeInTheDocument()
  })
  it('yıldız seçimi 8,5 değerini callback’e verir', async () => {
    const onRate = vi.fn()
    render(<RatingStars movieId={550} value={7} onRate={onRate} />)
    await userEvent.setup().click(screen.getByRole('button', { name: /8,5/ }))
    expect(onRate).toHaveBeenCalledWith(8.5)
  })
  it('500 hata olunca optimistic puanı geri alır', async () => {
    const client = new QueryClient({
      defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
    })
    const key = ratedMoviesQuery('guest-1').queryKey
    client.setQueryData(key, {
      page: 1,
      results: [{ id: 550, title: 'Dövüş Kulübü', rating: 7 }],
      total_pages: 1,
      total_results: 1,
    })
    let fail!: (response: Response) => void
    server.use(
      http.post(
        `${TMDB_BASE}/movie/:id/rating`,
        () =>
          new Promise<Response>((resolve) => {
            fail = resolve
          }),
      ),
    )
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
    const result = renderHook(() => useRateMovie('guest-1'), { wrapper })
    act(() => result.result.current.mutate({ movieId: 550, value: 8.5 }))
    await waitFor(() =>
      expect(
        client.getQueryData<{ results: Array<{ rating: number }> }>(key)?.results[0].rating,
      ).toBe(8.5),
    )
    await waitFor(() => expect(typeof fail).toBe('function'))
    fail(HttpResponse.json({}, { status: 500 }))
    await waitFor(() =>
      expect(
        client.getQueryData<{ results: Array<{ rating: number }> }>(key)?.results[0].rating,
      ).toBe(7),
    )
  })
})
