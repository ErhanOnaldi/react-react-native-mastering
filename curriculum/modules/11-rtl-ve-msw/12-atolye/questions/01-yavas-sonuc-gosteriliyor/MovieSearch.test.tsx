import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { MovieSearch } from '@exercise/MovieSearch'

describe('temizlenen arama', () => {
  it('boş alanda ağ isteği göndermez', async () => {
    render(<MovieSearch />)
    await waitFor(() => expect(requests('/3/search/movie')).toHaveLength(0))
  })
  it('yavaş eski cevap temizlenen alanda yeniden görünmez', async () => {
    const user = userEvent.setup()
    let release!: () => void
    server.use(
      http.get(`${TMDB_BASE}/search/movie`, async () => {
        await new Promise<void>((resolve) => {
          release = resolve
        })
        return HttpResponse.json({ results: [{ id: 550, title: 'Dövüş Kulübü' }] })
      }),
    )
    render(<MovieSearch />)
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'Dövüş')
    await waitFor(() => expect(typeof release).toBe('function'))
    await user.clear(screen.getByRole('textbox', { name: 'Film ara' }))
    release()
    await waitFor(() => expect(screen.queryByText('Dövüş Kulübü')).not.toBeInTheDocument())
    expect(
      requests('/3/search/movie').every((request) => Boolean(request.search.get('query'))),
    ).toBe(true)
  })
})
