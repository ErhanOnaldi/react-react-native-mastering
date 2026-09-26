import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { FavoritesProvider } from '@/features/favorites/context/FavoritesContext'
import { MovieDetailsPage } from '@/pages/MovieDetailsPage'
import { TMDB_BASE_URL } from '@/shared/api/tmdb-client'
import { renderWithRouter } from '@/test/render'
import { server } from '@/test/setup'

describe('MovieDetailsPage', () => {
  beforeEach(() => vi.stubEnv('VITE_TMDB_TOKEN', 'test-token'))

  function renderMovie(id: string) {
    return renderWithRouter(
      [
        {
          path: '/movie/:id',
          element: (
            <FavoritesProvider>
              <MovieDetailsPage />
            </FavoritesProvider>
          ),
        },
      ],
      { route: `/movie/${id}` },
    )
  }

  it('550 için Dövüş Kulübü başlığını gösterir', async () => {
    renderMovie('550')
    expect(
      await screen.findByRole('heading', { name: 'Dövüş Kulübü' }),
    ).toBeInTheDocument()
  })

  it('999999 için 404 hatasını kullanıcıya gösterir', async () => {
    renderMovie('999999')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Film bulunamadı',
    )
  })

  it('videosu olmayan filmde sekmelerde Videolar ve fragman düğmesi göstermez', async () => {
    renderMovie('550')
    expect(
      await screen.findByRole('tablist', { name: 'Film bilgileri' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Videolar' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Fragmanı aç' })).toBeNull()
  })

  it('YouTube fragmanını modalda açar', async () => {
    server.use(
      http.get(`${TMDB_BASE_URL}/movie/:id`, () =>
        HttpResponse.json({
          id: 603,
          title: 'Matrix',
          original_title: 'The Matrix',
          overview: 'Neo gerçekliği sorgular.',
          poster_path: null,
          backdrop_path: null,
          release_date: '1999-03-31',
          vote_average: 8.2,
          vote_count: 100,
          popularity: 10,
          adult: false,
          original_language: 'en',
          video: false,
          runtime: 136,
          genres: [],
          tagline: '',
          status: 'Released',
          budget: 0,
          revenue: 0,
          credits: { cast: [], crew: [] },
          videos: {
            results: [
              {
                id: 'v1',
                key: 'vKQi3bBA1y8',
                name: 'Matrix fragmanı',
                site: 'YouTube',
                type: 'Trailer',
                official: true,
                size: 1080,
                published_at: '2019-01-01T00:00:00.000Z',
              },
            ],
          },
        }),
      ),
    )
    const user = userEvent.setup()
    renderMovie('603')
    await user.click(await screen.findByRole('button', { name: 'Fragmanı aç' }))
    expect(
      screen.getByRole('link', { name: "YouTube'da izle" }),
    ).toHaveAttribute('href', 'https://www.youtube.com/watch?v=vKQi3bBA1y8')
    await user.click(screen.getByRole('button', { name: 'Kapat' }))
    expect(screen.getByRole('tab', { name: 'Videolar' })).toBeInTheDocument()
  })

  it('Film işlemleri menüsünde Favori seçimi durumunu değiştirir', async () => {
    localStorage.clear()
    const user = userEvent.setup()
    renderMovie('550')
    await user.click(
      await screen.findByRole('button', { name: 'Film işlemleri' }),
    )
    const favorite = await screen.findByRole('menuitemcheckbox', {
      name: 'Favori',
    })
    const before = favorite.getAttribute('aria-checked')
    await user.click(favorite)
    await user.click(screen.getByRole('button', { name: 'Film işlemleri' }))
    expect(
      await screen.findByRole('menuitemcheckbox', { name: 'Favori' }),
    ).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true')
  })
})
