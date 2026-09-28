import { render, screen } from '@testing-library/react'
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

describe('canlı trend sayfası', () => {
  it('ana sayfada TMDB trend cevabındaki filmi ve detay linkini gösterir', async () => {
    open('/')
    expect(
      await screen.findByRole('link', { name: 'Unabomber' }, { timeout: 4000 }),
    ).toHaveAttribute('href', '/movie/1492640')
    expect(requests('/3/trending/movie/week').length).toBeGreaterThan(0)
    expect(requests('/3/trending/movie/week')[0]?.search.get('language')).toBe('tr-TR')
  })
  it('başlangıçta yüklenme durumunu gösterir', () => {
    open('/')
    expect(screen.getByText(/filmler yükleniyor/i)).toBeInTheDocument()
  })
})
