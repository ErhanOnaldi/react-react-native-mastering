import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { MovieDetail } from '@exercise/MovieDetail'

describe('detay cache’i', () => {
  it('filmi Türkçe başlıkla gösterir', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MovieDetail id={550} />
      </QueryClientProvider>,
    )
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
    expect(requests('/3/movie/550')).toHaveLength(1)
  })
  it('geri dönüşte taze detay için ikinci istek atmaz', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrap = (ui: React.ReactNode) => (
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    )
    const view = render(wrap(<MovieDetail id={550} />))
    await screen.findByRole('heading', { name: 'Dövüş Kulübü' })
    view.rerender(wrap(<p>Arama sayfası</p>))
    view.rerender(wrap(<MovieDetail id={550} />))
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
    expect(requests('/3/movie/550'), 'Beklenen: 1 istek').toHaveLength(1)
  })
})
