import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'

describe('lazy favoriler route modülü', () => {
  it('lazy import sonrası Component alanını render eder', async () => {
    const router = createMemoryRouter(
      [
        { path: '/', element: <h1>Sinema</h1> },
        { path: '/favorites', lazy: () => import('@exercise/FavoriteRoute') },
      ],
      { initialEntries: ['/favorites'] },
    )
    render(<RouterProvider router={router} />)
    expect(await screen.findByRole('heading', { name: 'Favoriler' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ana sayfa' })).toHaveAttribute('href', '/')
  })
})
