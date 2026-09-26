import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { GenreDiscover } from '@exercise/GenreDiscover'

describe('tür değişen keşif', () => {
  it('komedi seçilince yeni sonucu gösterir ve istek türü değişir', async () => {
    const user = userEvent.setup()
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <GenreDiscover />
      </QueryClientProvider>,
    )
    expect(await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')).toBeInTheDocument()
    await user.selectOptions(screen.getByRole('combobox', { name: 'Tür' }), '35')
    expect(await screen.findByText("Coyote Acme'ye Karşı")).toBeInTheDocument()
    await waitFor(() =>
      expect(
        requests('/3/discover/movie').map((request) => request.search.get('with_genres')),
      ).toEqual(['28', '35']),
    )
  })
})
