import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { TrendingFeed } from '@exercise/TrendingFeed'
describe('sonsuz trend', () => {
  it('ikinci sayfayı eklerken ilk filmleri korur', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const user = userEvent.setup()
    render(
      <QueryClientProvider client={client}>
        <TrendingFeed />
      </QueryClientProvider>,
    )
    expect(await screen.findByText('Unabomber')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Daha fazla' }))
    expect(await screen.findByText('Koşucu')).toBeInTheDocument()
    expect(screen.getByText('Unabomber')).toBeInTheDocument()
    expect(requests('/3/trending/movie/week').map((r) => r.search.get('page'))).toEqual(['1', '2'])
  })
  it('sayfa sınırını aşmaz', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <TrendingFeed />
      </QueryClientProvider>,
    )
    await screen.findByText('Unabomber')
    expect(client.getQueryData(['movies', 'trending'])).toBeDefined()
  })
})
