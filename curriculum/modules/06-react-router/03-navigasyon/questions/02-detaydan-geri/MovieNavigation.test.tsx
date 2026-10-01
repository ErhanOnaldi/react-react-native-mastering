import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { MovieNavigation } from '@exercise/MovieNavigation'

const routes = [
  { path: '/search', element: <h1>Arama</h1> },
  { path: '/movie/:id', element: <MovieNavigation /> },
]
describe('detay navigasyonu', () => {
  it('bilinen arama adresini gerçek bağlantı olarak gösterir', () => {
    render(
      <RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/movie/550'] })} />,
    )
    expect(screen.getByRole('link', { name: 'Ara' })).toHaveAttribute('href', '/search')
  })
  it('geri eylemi arama geçmişindeki filtreli adrese döner', async () => {
    const router = createMemoryRouter(routes, {
      initialEntries: ['/search?q=Matrix&page=2', '/movie/550'],
      initialIndex: 1,
    })
    render(<RouterProvider router={router} />)
    await userEvent.click(screen.getByRole('button', { name: 'Aramaya dön' }))
    expect(router.state.location.pathname + router.state.location.search).toBe(
      '/search?q=Matrix&page=2',
    )
  })
})
