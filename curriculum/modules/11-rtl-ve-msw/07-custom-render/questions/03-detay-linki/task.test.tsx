import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { MovieRoute } from '@exercise/MovieRoute'
describe('MovieRoute', () => {
  it('URL id değerini gösterir ve link ile aramaya döner', async () => {
    const router = createMemoryRouter(
      [
        { path: '/movie/:id', element: <MovieRoute /> },
        { path: '/search', element: <h1>Arama</h1> },
      ],
      { initialEntries: ['/movie/603'] },
    )
    render(<RouterProvider router={router} />)
    expect(screen.getByRole('heading', { name: 'Film #603' })).toBeInTheDocument()
    await userEvent.setup().click(screen.getByRole('link', { name: 'Aramaya dön' }))
    expect(router.state.location.pathname).toBe('/search')
    expect(screen.getByRole('heading', { name: 'Arama' })).toBeInTheDocument()
  })
})
