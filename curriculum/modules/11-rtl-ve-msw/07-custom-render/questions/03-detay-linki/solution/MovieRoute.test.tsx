import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { MovieRoute } from '@impl/MovieRoute'

describe('MovieRoute', () => {
  it('URL film id’sini başlıkta gösterir', () => {
    const router = createMemoryRouter(
      [
        { path: '/movie/:id', element: <MovieRoute /> },
        { path: '/search', element: <h1>Arama</h1> },
      ],
      { initialEntries: ['/movie/603'] },
    )
    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: 'Film #603' })).toBeInTheDocument()
  })

  it('link tıklanınca arama sayfasına gider', async () => {
    const user = userEvent.setup()
    const router = createMemoryRouter(
      [
        { path: '/movie/:id', element: <MovieRoute /> },
        { path: '/search', element: <h1>Arama</h1> },
      ],
      { initialEntries: ['/movie/550'] },
    )
    render(<RouterProvider router={router} />)

    await user.click(screen.getByRole('link', { name: 'Aramaya dön' }))

    expect(router.state.location.pathname).toBe('/search')
    expect(screen.getByRole('heading', { name: 'Arama' })).toBeInTheDocument()
  })

  it('id olmayan route için açıklayıcı başlık gösterir', () => {
    const router = createMemoryRouter(
      [
        { path: '/movie/:id', element: <MovieRoute /> },
        { path: '/movie', element: <MovieRoute /> },
        { path: '/search', element: <h1>Arama</h1> },
      ],
      { initialEntries: ['/movie'] },
    )
    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: 'Film seçilmedi' })).toBeInTheDocument()
  })
})
