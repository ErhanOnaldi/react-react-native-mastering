import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { SearchControls } from '@exercise/SearchControls'

function open(url: string) {
  const router = createMemoryRouter([{ path: '/search', element: <SearchControls /> }], {
    initialEntries: [url],
  })
  render(<RouterProvider router={router} />)
  return router
}
describe('URL filtreleri', () => {
  it('doğrudan açılan bağlantıdaki sorgu ve sayfayı gösterir', () => {
    open('/search?q=Matrix&page=4&genre=28')
    expect(screen.getByRole('textbox', { name: 'Film ara' })).toHaveValue('Matrix')
    expect(screen.getByText('Sayfa 4')).toBeInTheDocument()
  })
  it('sorgu değişince eski sayfayı siler ve türü korur', async () => {
    const router = open('/search?q=Matrix&page=4&genre=28')
    await userEvent.clear(screen.getByRole('textbox', { name: 'Film ara' }))
    expect(router.state.location.search).not.toContain('page=4')
    expect(new URLSearchParams(router.state.location.search).get('genre')).toBe('28')
  })
  it('tür değişince sorguyu korur ve sayfayı sıfırlar', async () => {
    const router = open('/search?q=Matrix&page=4')
    await userEvent.click(screen.getByRole('button', { name: 'Aksiyon' }))
    const params = new URLSearchParams(router.state.location.search)
    expect(params.get('q')).toBe('Matrix')
    expect(params.get('genre')).toBe('28')
    expect(params.get('page')).toBeNull()
  })
})
