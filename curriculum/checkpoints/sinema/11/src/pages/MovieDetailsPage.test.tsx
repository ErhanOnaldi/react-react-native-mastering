import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FavoritesProvider } from '@/features/favorites/context/FavoritesContext'
import { MovieDetailsPage } from '@/pages/MovieDetailsPage'
import { renderWithRouter } from '@/test/render'

describe('MovieDetailsPage', () => {
  beforeEach(() => vi.stubEnv('VITE_TMDB_TOKEN', 'test-token'))

  function renderMovie(id: string) {
    return renderWithRouter(
      [{ path: '/movie/:id', element: <FavoritesProvider><MovieDetailsPage /></FavoritesProvider> }],
      { route: `/movie/${id}` },
    )
  }

  it('550 için Dövüş Kulübü başlığını gösterir', async () => {
    renderMovie('550')
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
  })

  it('999999 için 404 hatasını kullanıcıya gösterir', async () => {
    renderMovie('999999')
    expect(await screen.findByRole('alert')).toHaveTextContent('Film bulunamadı')
  })
})
