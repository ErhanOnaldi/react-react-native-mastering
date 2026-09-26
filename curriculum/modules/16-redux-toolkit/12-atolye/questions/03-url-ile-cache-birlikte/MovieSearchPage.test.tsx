import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { MovieSearchPage } from '@exercise/MovieSearchPage'

describe('film arama sayfası', () => {
  it('geri/ileri ile daha önce görülen aramaya döner, cache’ten okur', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter([{ path: '/search', element: <MovieSearchPage /> }], {
      initialEntries: ['/search?q=Matrix&page=1'],
    })
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    render(
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    )

    expect(await screen.findByText('Matrix')).toBeInTheDocument()
    expect(requests('/3/search/movie')).toHaveLength(1)

    fireEvent.change(screen.getByRole('textbox', { name: 'Arama' }), {
      target: { value: 'Dövüş' },
    })
    expect(await screen.findByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(router.state.location.search).toContain('page=1')
    expect(requests('/3/search/movie')).toHaveLength(2)

    await router.navigate(-1)
    expect(await screen.findByText('Matrix')).toBeInTheDocument()
    expect(requests('/3/search/movie')).toHaveLength(2)

    await router.navigate(1)
    expect(await screen.findByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(requests('/3/search/movie')).toHaveLength(2)

    await user.click(screen.getByRole('button', { name: 'Sonraki sayfa' }))
    expect(router.state.location.search).toContain('page=2')
  })
})
