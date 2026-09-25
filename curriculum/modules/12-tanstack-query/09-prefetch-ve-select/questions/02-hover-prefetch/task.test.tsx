import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { MovieHover } from '@exercise/MovieHover'
import { movieQueries } from '@exercise/movieQueries'
describe('hover prefetch', () => {
  it('fare karta gelince detayı önceden çeker', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MovieHover id={550} title="Dövüş Kulübü" />
      </QueryClientProvider>,
    )
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Dövüş Kulübü' }))
    await waitFor(() =>
      expect(client.getQueryData(movieQueries.detail(550).queryKey)).toBeDefined(),
    )
    await client.fetchQuery(movieQueries.detail(550))
    expect(requests('/3/movie/550'), 'Beklenen: hover ve detay toplam 1 istek').toHaveLength(1)
  })
  it('farklı kart farklı idyi getirir', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MovieHover id={27205} title="Başlangıç" />
      </QueryClientProvider>,
    )
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Başlangıç' }))
    await waitFor(() =>
      expect(client.getQueryData(movieQueries.detail(27205).queryKey)).toBeDefined(),
    )
    await client.fetchQuery(movieQueries.detail(27205))
    expect(requests('/3/movie/27205')).toHaveLength(1)
  })
})
