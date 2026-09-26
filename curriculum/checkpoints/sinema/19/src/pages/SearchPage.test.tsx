import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { FavoritesProvider } from '@/features/favorites/context/FavoritesContext'
import { SearchPage } from '@/pages/SearchPage'
import { TMDB_BASE_URL } from '@/shared/api/tmdb-client'
import { renderWithRouter } from '@/test/render'
import { server } from '@/test/setup'

function renderSearch(route = '/search?q=Matrix') {
  return renderWithRouter(
    [
      {
        path: '/search',
        element: (
          <FavoritesProvider>
            <SearchPage />
          </FavoritesProvider>
        ),
      },
    ],
    { route },
  )
}

describe('SearchPage', () => {
  beforeEach(() => vi.stubEnv('VITE_TMDB_TOKEN', 'test-token'))

  it('yazılan Matrix sorgusunu gönderir ve sonucu gösterir', async () => {
    const queries: string[] = []
    server.use(
      http.get(`${TMDB_BASE_URL}/search/movie`, ({ request }) => {
        queries.push(new URL(request.url).searchParams.get('query') ?? '')
        return HttpResponse.json({
          page: 1,
          results: [
            {
              id: 603,
              title: 'Matrix',
              original_title: 'The Matrix',
              overview: '',
              poster_path: null,
              backdrop_path: null,
              release_date: '1999-03-31',
              genre_ids: [28],
              vote_average: 8.7,
              vote_count: 100,
              popularity: 10,
              adult: false,
              original_language: 'en',
              video: false,
            },
          ],
          total_pages: 1,
          total_results: 1,
        })
      }),
    )
    renderSearch()
    const user = userEvent.setup()
    const search = screen.getByRole('textbox', { name: 'Film ara' })
    await user.clear(search)
    await user.type(search, 'Matrix')
    expect(
      await screen.findByRole('link', { name: 'Matrix' }),
    ).toBeInTheDocument()
    await waitFor(() => expect(queries).toContain('Matrix'))
  })

  it('boş sonuç için durum mesajı gösterir', async () => {
    server.use(
      http.get(`${TMDB_BASE_URL}/search/movie`, () =>
        HttpResponse.json({
          page: 1,
          results: [],
          total_pages: 0,
          total_results: 0,
        }),
      ),
    )
    renderSearch()
    expect(await screen.findByText('Film bulunamadı')).toHaveAttribute(
      'role',
      'status',
    )
  })

  it('500 cevabında kullanıcıya hata gösterir', async () => {
    server.use(
      http.get(`${TMDB_BASE_URL}/search/movie`, () =>
        HttpResponse.json(
          { status_code: 11, status_message: 'Sunucu hatası.' },
          { status: 500 },
        ),
      ),
    )
    renderSearch()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Arama başarısız',
    )
  })
})
