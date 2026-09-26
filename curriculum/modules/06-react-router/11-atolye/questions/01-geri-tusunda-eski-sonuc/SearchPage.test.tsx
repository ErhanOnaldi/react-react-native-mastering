import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { describe, expect, it } from 'vitest'
import { delay, http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { SearchPage } from '@exercise/SearchPage'

function open() {
  const router = createMemoryRouter([{ path: '/search', element: <SearchPage /> }], {
    initialEntries: ['/search?q=matrix'],
  })
  render(<RouterProvider router={router} />)
  return router
}

describe('URL değişirken arama sonucu', () => {
  it('geri dönüşte adres matrix iken geç gelen eski sonucu göstermez', async () => {
    server.use(
      http.get(`${TMDB_BASE}/search/movie`, async ({ request }) => {
        const query = new URL(request.url).searchParams.get('query')
        await delay(query === 'dovus' ? 110 : 5)
        const movie =
          query === 'dovus' ? { id: 550, title: 'Dövüş Kulübü' } : { id: 603, title: 'Matrix' }
        return HttpResponse.json({ page: 1, results: [movie], total_pages: 1, total_results: 1 })
      }),
    )
    const router = open()
    await screen.findByText('Matrix')
    await userEvent.click(screen.getByRole('link', { name: 'Dövüş ara' }))
    await waitFor(() => expect(requests('/3/search/movie')).toHaveLength(2))
    await router.navigate(-1)
    await waitFor(() => expect(requests('/3/search/movie')).toHaveLength(3))
    await delay(140)
    expect(router.state.location.search).toBe('?q=matrix')
    expect(screen.getByText('Matrix')).toBeInTheDocument()
    expect(screen.queryByText('Dövüş Kulübü')).not.toBeInTheDocument()
  })

  it('URL sorgusu değişince yeni sonuç için ayrı istek gönderir', async () => {
    const router = open()
    await screen.findByText('Matrix')
    await userEvent.click(screen.getByRole('link', { name: 'Dövüş ara' }))
    expect(await screen.findByText('Dövüş Kulübü')).toBeInTheDocument()
    expect(router.state.location.search).toBe('?q=dovus')
    expect(requests('/3/search/movie').map((request) => request.search.get('query'))).toEqual([
      'matrix',
      'dovus',
    ])
  })
})
