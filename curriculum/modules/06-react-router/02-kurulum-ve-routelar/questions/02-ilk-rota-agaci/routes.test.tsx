import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { routes } from '@exercise/routes'

describe('rota ağacı', () => {
  it('kök adreste Sinema başlığını gösterir', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)
    expect(screen.getByRole('heading', { name: 'Sinema' })).toBeInTheDocument()
  })
  it('Ara bağlantısı adresi değiştirip arama sayfasını açar', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(<RouterProvider router={router} />)
    await userEvent.click(screen.getByRole('link', { name: 'Ara' }))
    expect(router.state.location.pathname).toBe('/search')
    expect(screen.getByRole('heading', { name: 'Film ara' })).toBeInTheDocument()
  })
})
