import { render, screen, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { server, http, HttpResponse, TMDB_BASE, delay } from '@test-utils'
import { SearchTitle } from '@exercise/SearchTitle'
describe('SearchTitle', () => {
  it('hızlı ikinci sorgunun sonucunu eski cevapla ezmez', async () => {
    server.use(
      http.get(`${TMDB_BASE}/search/movie`, async ({ request }) => {
        const q = new URL(request.url).searchParams.get('query')
        await delay(q === 'eski' ? 90 : 5)
        return HttpResponse.json({ results: [{ title: q === 'eski' ? 'Eski Film' : 'Yeni Film' }] })
      }),
    )
    const view = render(<SearchTitle query="eski" />)
    view.rerender(<SearchTitle query="yeni" />)
    expect(await screen.findByText('Yeni Film')).toBeInTheDocument()
    await act(async () => {
      await new Promise((r) => setTimeout(r, 110))
    })
    expect(screen.getByText('Yeni Film')).toBeInTheDocument()
  })
})
