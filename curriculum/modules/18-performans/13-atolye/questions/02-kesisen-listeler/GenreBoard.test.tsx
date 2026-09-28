import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { catalog, delay, http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { GenreBoard } from '@exercise/GenreBoard'

function renderBoard() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  const router = createMemoryRouter([{ path: '/board', element: <GenreBoard /> }], {
    initialEntries: ['/board'],
  })
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('kesişen listeler', () => {
  it('hızlı tür değişiminde yavaş cevap yanlış listeyi ele geçirmez', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(`${TMDB_BASE}/discover/movie`, async ({ request }) => {
        const genre = Number(new URL(request.url).searchParams.get('with_genres'))
        await delay(genre === 28 ? 120 : 5)
        const results = catalog.filter((movie) => movie.genre_ids.includes(genre))
        return HttpResponse.json({
          page: 1,
          results,
          total_pages: 1,
          total_results: results.length,
        })
      }),
    )
    renderBoard()
    // Varsayılan sekme "Aksiyon" (28); yavaş cevap havada kalırken hızlı "Komedi"ye geç.
    await user.click(screen.getByRole('button', { name: 'Komedi' }))
    expect(await screen.findByText("Coyote Acme'ye Karşı")).toBeInTheDocument()
    await delay(150)
    expect(screen.getByText("Coyote Acme'ye Karşı")).toBeInTheDocument()
    expect(screen.queryByText('Örümcek-Adam: Yepyeni Bir Gün')).not.toBeInTheDocument()
  })

  it('film puanlanınca Puanladıklarım listesi güncellenir', async () => {
    const user = userEvent.setup()
    renderBoard()
    const rateButton = await screen.findByRole('button', {
      name: 'Örümcek-Adam: Yepyeni Bir Gün puanla',
    })
    await waitFor(() => expect(rateButton).toBeEnabled())
    await user.click(rateButton)
    const ratedSection = screen.getByRole('region', { name: 'Puanladıklarım' })
    expect(
      await within(ratedSection).findByText('Örümcek-Adam: Yepyeni Bir Gün'),
    ).toBeInTheDocument()
    expect(requests(/rated\/movies/).length).toBeGreaterThan(1)
  })
})
