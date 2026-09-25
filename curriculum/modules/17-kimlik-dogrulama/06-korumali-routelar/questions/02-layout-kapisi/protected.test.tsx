import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router'
import { describe, expect, it } from 'vitest'
import { ProtectedRoute } from '@exercise/ProtectedRoute'

function Login() {
  const location = useLocation()
  return <p>Giriş: {(location.state as { from?: string } | null)?.from ?? 'doğrudan'}</p>
}
function makeRouter(authenticated: boolean, path: string) {
  return createMemoryRouter(
    [
      { path: '/login', element: <Login /> },
      {
        element: <ProtectedRoute isAuthenticated={authenticated} />,
        children: [
          { path: '/watchlists', element: <h1>İzleme listelerim</h1> },
          { path: '/profile', element: <h1>Profilim</h1> },
        ],
      },
    ],
    { initialEntries: [path] },
  )
}
describe('korumalı layout route', () => {
  it('oturum varsa çocuk watchlist sayfasını gösterir', async () => {
    render(<RouterProvider router={makeRouter(true, '/watchlists')} />)
    expect(await screen.findByRole('heading', { name: 'İzleme listelerim' })).toBeInTheDocument()
  })
  it('oturum yoksa login’e yönlendirir ve dönüş yolunu saklar', async () => {
    render(<RouterProvider router={makeRouter(false, '/watchlists')} />)
    expect(await screen.findByText('Giriş: /watchlists')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'İzleme listelerim' })).not.toBeInTheDocument()
  })
  it('aynı kapı profil sayfasını da korur', async () => {
    const router = makeRouter(false, '/profile')
    render(<RouterProvider router={router} />)
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'))
    expect(screen.getByText('Giriş: /profile')).toBeInTheDocument()
  })
})
