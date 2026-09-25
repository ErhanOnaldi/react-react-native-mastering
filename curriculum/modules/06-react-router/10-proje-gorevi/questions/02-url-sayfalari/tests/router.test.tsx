import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { FavoritesProvider } from '@project/src/context/FavoritesContext'
import { routes } from '@project/src/router'

function open(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <FavoritesProvider>
      <RouterProvider router={router} />
    </FavoritesProvider>,
  )
  return router
}
describe('Sinema URL sayfaları', () => {
  it('paylaşılan arama adresinde sorguyu ve statik sonucu gösterir', () => {
    open('/search?q=Matrix')
    expect(screen.getByRole('textbox', { name: /ara/i })).toHaveValue('Matrix')
    expect(screen.getByText('Matrix')).toBeInTheDocument()
    expect(screen.queryByText('Dövüş Kulübü')).not.toBeInTheDocument()
  })
  it('sorgu değişince eski sayfayı siler ve türü korur', async () => {
    const router = open('/search?q=Matrix&page=4&genre=28')
    await userEvent.clear(screen.getByRole('textbox', { name: /ara/i }))
    const params = new URLSearchParams(router.state.location.search)
    expect(params.get('page')).toBeNull()
    expect(params.get('genre')).toBe('28')
  })
  it('film id adresi yenileme benzeri doğrudan açılışta doğru filmi gösterir', () => {
    open('/movie/550')
    expect(screen.getByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
  })
  it('olmayan sayısal id için anlaşılır mesaj gösterir', () => {
    open('/movie/999999')
    expect(screen.getByText(/film bulunamadı/i)).toBeInTheDocument()
  })
})
