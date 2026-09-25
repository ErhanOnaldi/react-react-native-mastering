import { render, screen } from '@testing-library/react'
import { createMemoryRouter, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it, vi } from 'vitest'
import { NotFoundPage, RouteError } from '@exercise/RouteScreens'

function open(path: string) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: (
          <>
            <h1>Sinema</h1>
            <Outlet />
          </>
        ),
        errorElement: <RouteError />,
        children: [
          {
            path: 'broken',
            loader: () => {
              throw new Error('gizli teknik ayrıntı')
            },
            element: <p>Veri</p>,
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
    { initialEntries: [path] },
  )
  render(<RouterProvider router={router} />)
}
describe('rota hata ekranları', () => {
  it('bilinmeyen adres için kullanıcıya 404 ve dönüş bağlantısı gösterir', () => {
    open('/hic-yok')
    expect(screen.getByRole('heading', { name: 'Sayfa bulunamadı' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ana sayfaya dön' })).toHaveAttribute('href', '/')
  })
  it('loader hatasında güvenli mesaj gösterir, teknik metni sızdırmaz', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      open('/broken')
      expect(await screen.findByRole('alert')).toHaveTextContent('Bir şeyler ters gitti')
      expect(screen.queryByText('gizli teknik ayrıntı')).not.toBeInTheDocument()
    } finally {
      spy.mockRestore()
    }
  })
})
