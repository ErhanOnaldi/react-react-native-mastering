import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { MovieTitles } from '@exercise/MovieTitles'
describe('select ile başlıklar', () => {
  it('popüler filmlerin başlıklarını gösterir', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MovieTitles />
      </QueryClientProvider>,
    )
    expect(await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')).toBeInTheDocument()
    expect(requests('/3/movie/popular')).toHaveLength(1)
  })
  it('cachede ham listeyi tutar', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <MovieTitles />
      </QueryClientProvider>,
    )
    await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')
    const raw = client.getQueryData<{ results: { id: number; title: string }[] }>([
      'movies',
      'popular',
    ])
    expect(raw?.results[0].id).toBe(969681)
  })
})
