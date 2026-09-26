import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { GenreDiscover } from '@exercise/GenreDiscover'

describe('türe göre keşif', () => {
  it('tür ve sayfa değişince doğru isteği gönderir; geri dönünce eski seçimi gösterir', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([{ path: '/discover', element: <GenreDiscover /> }], {
      initialEntries: ['/discover?genre=28&page=1'],
    })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )
    expect(await screen.findByText('Örümcek-Adam: Yepyeni Bir Gün')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sonraki sayfa' }))
    await waitFor(() =>
      expect(
        requests('/3/discover/movie').some(
          (request) =>
            request.search.get('with_genres') === '28' && request.search.get('page') === '2',
        ),
      ).toBe(true),
    )
    await user.selectOptions(screen.getByRole('combobox', { name: 'Tür' }), '35')
    expect(await screen.findByText("Coyote Acme'ye Karşı")).toBeInTheDocument()
    expect(router.state.location.search).toContain('page=1')
    await router.navigate(-1)
    await waitFor(() => expect(screen.getByText('Sayfa 2')).toBeInTheDocument())
    expect(screen.getByRole('combobox', { name: 'Tür' })).toHaveValue('28')
    expect(
      requests('/3/discover/movie').some((request) => request.search.get('with_genres') === '35'),
    ).toBe(true)
  })
})
