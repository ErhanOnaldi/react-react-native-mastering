import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { delay, http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { MovieSearch } from '@exercise/MovieSearch'

describe('ardışık arama', () => {
  it('eski istek geç bitse de son yazılan filmin sonucunu gösterir', async () => {
    server.use(
      http.get(`${TMDB_BASE}/search/movie`, async ({ request }) => {
        const query = new URL(request.url).searchParams.get('query')
        await delay(query === 'Dövüş' ? 100 : 5)
        const movie =
          query === 'Dövüş' ? { id: 550, title: 'Dövüş Kulübü' } : { id: 603, title: 'Matrix' }
        return HttpResponse.json({ page: 1, results: [movie], total_pages: 1, total_results: 1 })
      }),
    )
    render(<MovieSearch />)
    const input = screen.getByRole('textbox', { name: 'Film ara' })
    fireEvent.change(input, { target: { value: 'Dövüş' } })
    await waitFor(() => expect(requests('/3/search/movie')).toHaveLength(1))
    fireEvent.change(input, { target: { value: 'Matrix' } })
    expect(await screen.findByText('Matrix')).toBeInTheDocument()
    await waitFor(() => expect(requests('/3/search/movie')).toHaveLength(2))
    await delay(125)
    expect(screen.getByText('Matrix')).toBeInTheDocument()
    expect(screen.queryByText('Dövüş Kulübü')).not.toBeInTheDocument()
    expect(requests('/3/search/movie').map((request) => request.search.get('query'))).toEqual([
      'Dövüş',
      'Matrix',
    ])
  })
})
