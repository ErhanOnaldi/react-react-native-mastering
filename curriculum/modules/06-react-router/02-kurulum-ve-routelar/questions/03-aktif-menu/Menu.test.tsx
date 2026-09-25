import { render, screen } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { Menu } from '@exercise/Menu'

function open(path: string) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <Menu /> },
      { path: '/search', element: <Menu /> },
    ],
    { initialEntries: [path] },
  )
  render(<RouterProvider router={router} />)
}

describe('aktif menü', () => {
  it('kök adreste yalnızca Ana sayfa bağlantısı etkin olur', () => {
    open('/')
    expect(screen.getByRole('link', { name: 'Ana sayfa' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Ara' })).not.toHaveAttribute('aria-current')
  })
  it('arama adresinde yalnızca Ara bağlantısı etkin olur', () => {
    open('/search')
    expect(screen.getByRole('link', { name: 'Ara' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Ana sayfa' })).not.toHaveAttribute('aria-current')
  })
})
