import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { MovieDetail } from '@exercise/MovieDetail'

describe('detay cache’i', () => {
  it('filmi Türkçe başlıkla gösterir', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MovieDetail id={550} />
      </QueryClientProvider>,
    )
    expect(screen.getByText('Yükleniyor')).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
  it('id değişince yeni film detayını ister', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrap = (ui: React.ReactNode) => (
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    )
    const view = render(wrap(<MovieDetail id={550} />))
    await screen.findByRole('heading', { name: 'Dövüş Kulübü' })
    view.rerender(wrap(<MovieDetail id={27205} />))
    expect(await screen.findByRole('heading', { name: 'Başlangıç' })).toBeInTheDocument()
    expect(requests('/3/movie/550')).toHaveLength(1)
    expect(requests('/3/movie/27205')).toHaveLength(1)
  })

  it('HTTP hatasını görünür hata durumuna çevirir', async () => {
    server.use(http.get(`${TMDB_BASE}/movie/550`, () => HttpResponse.json({}, { status: 500 })))
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MovieDetail id={550} />
      </QueryClientProvider>,
    )
    expect(await screen.findByText('Hata: Film yüklenemedi')).toBeInTheDocument()
  })
})
