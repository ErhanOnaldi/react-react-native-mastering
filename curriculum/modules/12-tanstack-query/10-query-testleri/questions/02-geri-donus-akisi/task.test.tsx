import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { SearchAgain } from '@exercise/SearchAgain'
describe('arama geri dönüşü', () => {
  it('detaydan aynı aramaya dönünce ikinci GET atmaz', async () => {
    const user = userEvent.setup()
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <SearchAgain query="Dövüş" />
      </QueryClientProvider>,
    )
    await screen.findByText('Dövüş Kulübü')
    await user.click(screen.getByRole('button', { name: 'Detay' }))
    expect(screen.getByText('Detay sayfası')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Geri' }))
    expect(await screen.findByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(requests('/3/search/movie'), 'Beklenen: geri dönüşte toplam 1 istek').toHaveLength(1)
  })
  it('arama değişince yeni GET gönderir', async () => {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    const wrap = (q: string) => (
      <QueryClientProvider client={client}>
        <SearchAgain query={q} />
      </QueryClientProvider>
    )
    const view = render(wrap('Dövüş'))
    await screen.findByText('Dövüş Kulübü')
    view.rerender(wrap('Matrix'))
    await screen.findByText('Matrix')
    expect(requests('/3/search/movie').map((r) => r.search.get('query'))).toEqual([
      'Dövüş',
      'Matrix',
    ])
  })
})
