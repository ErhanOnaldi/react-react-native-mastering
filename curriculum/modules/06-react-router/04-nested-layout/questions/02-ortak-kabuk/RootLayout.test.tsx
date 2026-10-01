import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { RootLayout } from '@exercise/RootLayout'

const routes = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <h1>Filmler</h1> },
      { path: 'search', element: <h1>Arama</h1> },
    ],
  },
]

describe('ortak layout', () => {
  it('ana sayfada menü ve index sayfasını birlikte gösterir', () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />)
    expect(screen.getByRole('navigation', { name: 'Ana menü' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('heading', { name: 'Filmler' }),
    )
  })
  it('arama adresinde aynı menüyle arama içeriğini gösterir', () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/search'] })} />)
    expect(screen.getByRole('main')).toContainElement(
      screen.getByRole('heading', { name: 'Arama' }),
    )
    expect(screen.getByRole('link', { name: 'Ara' })).toHaveAttribute('aria-current', 'page')
  })
})
