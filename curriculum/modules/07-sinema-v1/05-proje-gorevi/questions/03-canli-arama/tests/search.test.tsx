import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
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

describe('canlı arama sayfası', () => {
  it('paylaşılan URL sorgusuyla Türkçe TMDB sonucunu gösterir', async () => {
    open('/search?q=Başlangıç')
    expect(screen.getByRole('textbox', { name: /ara/i })).toHaveValue('Başlangıç')
    expect(await screen.findByRole('link', { name: 'Başlangıç' })).toBeInTheDocument()
    expect(requests('/3/search/movie')[0]?.search.get('query')).toBe('Başlangıç')
    expect(requests('/3/search/movie')[0]?.search.get('language')).toBe('tr-TR')
  })
  it('boş sorguda arama isteği atmaz', async () => {
    open('/search')
    expect(screen.getByText(/aramak için/i)).toBeInTheDocument()
    expect(requests('/3/search/movie')).toHaveLength(0)
  })
  it('sorgu değişince eski sayfayı siler ve diğer URL değerlerini korur', async () => {
    const router = open('/search?q=Matrix&page=4&genre=28')
    await userEvent.clear(screen.getByRole('textbox', { name: /ara/i }))
    const params = new URLSearchParams(router.state.location.search)
    expect(params.has('page')).toBe(false)
    expect(params.get('genre')).toBe('28')
  })
  it('detaydan geri dönünce arama sonucunu yeniden gösterir ve istek sayısını gözlemler', async () => {
    const router = open('/search?q=Matrix')
    await userEvent.click(await screen.findByRole('link', { name: 'Matrix' }, { timeout: 4000 }))
    expect(
      await screen.findByRole('heading', { name: 'Matrix' }, { timeout: 4000 }),
    ).toBeInTheDocument()
    await router.navigate(-1)
    expect(
      await screen.findByRole('link', { name: 'Matrix' }, { timeout: 4000 }),
    ).toBeInTheDocument()
    const searchRequests = requests('/3/search/movie').length
    expect(searchRequests).toBeGreaterThan(0)
  })
})
