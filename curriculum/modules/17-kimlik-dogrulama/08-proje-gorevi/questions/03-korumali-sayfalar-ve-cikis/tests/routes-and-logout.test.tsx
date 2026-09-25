import { QueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'
import type { RouteObject } from 'react-router'
import { describe, expect, it, vi } from 'vitest'
import { ProtectedRoute } from '@project/src/features/auth/ProtectedRoute'
import { logout } from '@project/src/features/auth/logout'
import { routes } from '@project/src/router'

function paths(items: RouteObject[]): string[] {
  return items.flatMap((item) => [...(item.path ? [item.path] : []), ...paths(item.children ?? [])])
}
function Login() {
  const location = useLocation()
  return <p>Giriş: {(location.state as { from?: string } | null)?.from}</p>
}
describe('Sinema özel sayfaları ve çıkış', () => {
  it('router login, watchlists ve profile yollarını içerir', () => {
    const all = paths(routes)
    expect(all).toContain('login')
    expect(all).toContain('watchlists')
    expect(all).toContain('profile')
    expect(
      routes.some((root) =>
        root.children?.some(
          (parent) =>
            !parent.path &&
            ['watchlists', 'profile'].every((path) =>
              parent.children?.some((child) => child.path === path),
            ),
        ),
      ),
    ).toBe(true)
  })
  it('girişsiz watchlist isteği login’e gider ve dönüş yolunu taşır', async () => {
    const router = createMemoryRouter(
      [
        { path: '/login', element: <Login /> },
        {
          element: <ProtectedRoute isAuthenticated={false} />,
          children: [{ path: '/watchlists', element: <h1>Özel liste</h1> }],
        },
      ],
      { initialEntries: ['/watchlists'] },
    )
    render(<RouterProvider router={router} />)
    expect(await screen.findByText('Giriş: /watchlists')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Özel liste' })).not.toBeInTheDocument()
  })
  it('giriş varsa özel route çocuğunu gösterir', async () => {
    const router = createMemoryRouter(
      [
        { path: '/login', element: <Login /> },
        {
          element: <ProtectedRoute isAuthenticated={true} />,
          children: [{ path: '/watchlists', element: <h1>Özel liste</h1> }],
        },
      ],
      { initialEntries: ['/watchlists'] },
    )
    render(<RouterProvider router={router} />)
    expect(await screen.findByRole('heading', { name: 'Özel liste' })).toBeInTheDocument()
  })
  it('çıkışta kalıcı token, store ve query cache temizlenir', () => {
    const queryClient = new QueryClient()
    queryClient.setQueryData(['profile'], { username: 'emilys' })
    const removeItem = vi.fn()
    const resetStore = vi.fn()
    logout({ queryClient, storage: { removeItem }, resetStore })
    expect(removeItem).toHaveBeenCalledWith('sinema-auth')
    expect(resetStore).toHaveBeenCalledOnce()
    expect(queryClient.getQueryData(['profile'])).toBeUndefined()
  })
})
