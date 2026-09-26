import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { MovieRating } from '@exercise/MovieRating'

describe('film puanı ve puanladıklarım', () => {
  it('başarılı puanlamadan sonra ilişkili listeyi günceller', async () => {
    const user = userEvent.setup()
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    render(
      <QueryClientProvider client={client}>
        <MovieRating />
      </QueryClientProvider>,
    )
    await waitFor(() => expect(screen.getByRole('button', { name: '7 puan ver' })).toBeEnabled())
    await waitFor(() => expect(screen.queryByText('Liste yükleniyor')).not.toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: '7 puan ver' }))
    expect(await screen.findByText('Puan: 7')).toBeInTheDocument()
    expect(await screen.findByText('7 puan')).toBeInTheDocument()
    await waitFor(() => expect(requests(/rated\/movies/).length).toBeGreaterThan(1))
  })
  it('500 sonrası geçici puanı geri alır ve eski listeyi korur', async () => {
    const user = userEvent.setup()
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    })
    let savedRating: number | null = null
    let fail!: () => void
    server.use(
      http.post(`${TMDB_BASE}/movie/:id/rating`, async ({ request }) => {
        const body = (await request.json()) as { value: number }
        if (body.value === 8.5) {
          await new Promise<void>((resolve) => {
            fail = resolve
          })
          return HttpResponse.json({}, { status: 500 })
        }
        savedRating = body.value
        return HttpResponse.json({ success: true }, { status: 201 })
      }),
      http.get(`${TMDB_BASE}/guest_session/:id/rated/movies`, () =>
        HttpResponse.json({
          results:
            savedRating === null ? [] : [{ id: 550, title: 'Dövüş Kulübü', rating: savedRating }],
        }),
      ),
    )
    render(
      <QueryClientProvider client={client}>
        <MovieRating />
      </QueryClientProvider>,
    )
    await waitFor(() => expect(screen.getByRole('button', { name: '7 puan ver' })).toBeEnabled())
    await waitFor(() => expect(screen.queryByText('Liste yükleniyor')).not.toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: '7 puan ver' }))
    await screen.findByText('7 puan')
    await user.click(screen.getByRole('button', { name: '8,5 puan ver' }))
    expect(await screen.findByText('Puan: 8.5')).toBeInTheDocument()
    await waitFor(() => expect(typeof fail).toBe('function'))
    fail()
    expect(await screen.findByRole('alert')).toHaveTextContent('kaydedilemedi')
    await waitFor(() => expect(screen.getByText('Puan: 7')).toBeInTheDocument())
    expect(screen.getByText('7 puan')).toBeInTheDocument()
  })
})
