import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { FavoritesProvider } from '@project/src/context/FavoritesContext'
import { router, routes } from '@project/src/router'

function open(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>,
  )
  return router
}
describe('Sinema rota iskeleti', () => {
  it('ortak menü arama ve favorilere gerçek bağlantılar sunar', () => {
    open('/')
    expect(router).toBeDefined()
    expect(routes[0]?.errorElement).toBeDefined()
    expect(screen.getByRole('link', { name: 'Ana sayfa' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Ara' })).toHaveAttribute('href', '/search')
    expect(screen.getByRole('link', { name: 'Favoriler' })).toHaveAttribute('href', '/favorites')
  })
  it('menüden aramaya geçince adres ve aktif bağlantı değişir', async () => {
    const router = open('/')
    await userEvent.click(screen.getByRole('link', { name: 'Ara' }))
    expect(router.state.location.pathname).toBe('/search')
    expect(screen.getByRole('link', { name: 'Ara' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Ana sayfa' })).not.toHaveAttribute('aria-current')
  })
  it('bilinmeyen adres için 404 ve geri dönüş gösterir', () => {
    open('/olmayan')
    expect(screen.getByRole('heading', { name: /sayfa bulunamadı/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /ana sayfaya dön/i })).toHaveAttribute('href', '/')
  })
})
