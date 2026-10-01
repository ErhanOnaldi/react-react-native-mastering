import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { delay, http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { MoviePages } from '@exercise/MoviePages'
describe('sayfa geçişi', () => {
  it('yeni sayfa gelirken önceki filmleri geçici gösterir', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrap = (page: number) => (
      <QueryClientProvider client={client}>
        <MoviePages page={page} />
      </QueryClientProvider>
    )
    const view = render(wrap(1))
    const first = await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')
    server.use(
      http.get(`${TMDB_BASE}/movie/popular`, async ({ request }) => {
        await delay(100)
        return HttpResponse.json({
          page: 2,
          results: [{ id: 1386315, title: 'Koşucu' }],
          total_pages: 5,
          total_results: 100,
        })
      }),
    )
    view.rerender(wrap(2))
    expect(screen.getByText('Yeni sayfa yükleniyor')).toBeInTheDocument()
    expect(first).toBeInTheDocument()
    expect(await screen.findByText('Koşucu')).toBeInTheDocument()
    expect(screen.getByText('Sonuç sayısı: 100')).toBeInTheDocument()
    expect(requests('/3/movie/popular')).toHaveLength(2)
  })
  it('key değişince istenen page parametresini gönderir', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MoviePages page={2} />
      </QueryClientProvider>,
    )
    await screen.findByText('Koşucu')
    expect(requests('/3/movie/popular')[0].search.get('page')).toBe('2')
  })
})
