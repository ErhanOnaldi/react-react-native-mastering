import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { PopularMovies } from '@exercise/PopularMovies'

function client() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } })
}
describe('popüler filmler', () => {
  it('kısa sürede geri dönünce aynı liste için ikinci istek atmaz', async () => {
    const queryClient = client()
    const tree = () => (
      <QueryClientProvider client={queryClient}>
        <PopularMovies />
      </QueryClientProvider>
    )
    const view = render(tree())
    expect(await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')).toBeInTheDocument()
    view.unmount()
    render(tree())
    expect(await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')).toBeInTheDocument()
    expect(requests('/3/movie/popular')).toHaveLength(1)
  })
  it('sunucu hatasını görünür uyarı olarak gösterir', async () => {
    server.use(http.get(`${TMDB_BASE}/movie/popular`, () => HttpResponse.json({}, { status: 500 })))
    render(
      <QueryClientProvider client={client()}>
        <PopularMovies />
      </QueryClientProvider>,
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('yüklenemedi')
  })
})
