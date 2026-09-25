import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { SearchPage } from '@exercise/SearchPage'

const movies = [
  { id: 550, title: 'Dövüş Kulübü', genre_ids: [18] },
  { id: 155, title: 'Kara Şövalye', genre_ids: [28] },
  { id: 603, title: 'Matrix', genre_ids: [28] },
  { id: 27205, title: 'Başlangıç', genre_ids: [28] },
]
function open(url: string) {
  const router = createMemoryRouter(
    [{ path: '/search', element: <SearchPage movies={movies} pageSize={2} /> }],
    { initialEntries: [url] },
  )
  render(<RouterProvider router={router} />)
  return router
}
describe('paylaşılabilir arama sayfası', () => {
  it('doğrudan açılan URL’de sorgu, tür ve sayfayı gösterir', () => {
    open('/search?q=a&genre=28&page=2')
    expect(screen.getByRole('textbox', { name: 'Film ara' })).toHaveValue('a')
    expect(screen.getByRole('combobox', { name: 'Tür' })).toHaveValue('28')
    expect(screen.getByText('Sayfa 2')).toBeInTheDocument()
    expect(screen.getByText('Başlangıç')).toBeInTheDocument()
    expect(screen.queryByText('Kara Şövalye')).not.toBeInTheDocument()
  })
  it('sonraki sayfaya geçerken sorgu ve türü korur', async () => {
    const router = open('/search?q=a&genre=28')
    await userEvent.click(screen.getByRole('button', { name: 'Sonraki sayfa' }))
    const params = new URLSearchParams(router.state.location.search)
    expect(params.get('page')).toBe('2')
    expect(params.get('q')).toBe('a')
    expect(params.get('genre')).toBe('28')
  })
  it('arama değişince eski sayfayı siler, türü korur ve listeyi günceller', async () => {
    const router = open('/search?q=Matrix&genre=28&page=4')
    await userEvent.clear(screen.getByRole('textbox', { name: 'Film ara' }))
    const params = new URLSearchParams(router.state.location.search)
    expect(params.get('page')).toBeNull()
    expect(params.get('genre')).toBe('28')
    expect(screen.getByText('Kara Şövalye')).toBeInTheDocument()
  })
  it('tür değişince sorguyu korur ve sayfayı sıfırlar', async () => {
    const router = open('/search?q=a&page=2')
    await userEvent.selectOptions(screen.getByRole('combobox', { name: 'Tür' }), '28')
    const params = new URLSearchParams(router.state.location.search)
    expect(params.get('q')).toBe('a')
    expect(params.get('genre')).toBe('28')
    expect(params.get('page')).toBeNull()
  })
  it('bozuk sayfayı birinci sayfa sayar', () => {
    open('/search?page=abc')
    expect(screen.getByText('Sayfa 1')).toBeInTheDocument()
    expect(screen.getByText('Dövüş Kulübü')).toBeInTheDocument()
  })
})
