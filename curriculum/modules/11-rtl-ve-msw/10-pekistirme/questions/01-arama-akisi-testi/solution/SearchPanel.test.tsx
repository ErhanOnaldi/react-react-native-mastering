import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { server, http, HttpResponse, TMDB_BASE, requests, delay } from '@test-utils'
import { SearchPanel } from '@impl/SearchPanel'
async function search() {
  const user = userEvent.setup()
  render(<SearchPanel />)
  await user.type(screen.getByRole('searchbox', { name: 'Film ara' }), 'Matrix')
  await user.click(screen.getByRole('button', { name: 'Ara' }))
}
describe('SearchPanel', () => {
  it('kullanıcı arar ve film başlığını görür', async () => {
    server.use(
      http.get(`${TMDB_BASE}/search/movie`, async () => {
        await delay(150)
        return HttpResponse.json({
          page: 1,
          results: [{ id: 603, title: 'Matrix' }],
          total_pages: 1,
          total_results: 1,
        })
      }),
    )
    await search()
    expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor')
    expect(await screen.findByRole('heading', { name: 'Matrix' })).toBeInTheDocument()
    expect(requests('/3/search/movie')[0]?.search.get('query')).toBe('Matrix')
  })
  it('boş cevapta açıklayıcı mesaj görür', async () => {
    server.use(
      http.get(`${TMDB_BASE}/search/movie`, () =>
        HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 }),
      ),
    )
    await search()
    expect(await screen.findByText('Film bulunamadı')).toHaveAttribute('role', 'status')
  })
  it('sunucu hatasında alert görür', async () => {
    server.use(http.get(`${TMDB_BASE}/search/movie`, () => HttpResponse.json({}, { status: 500 })))
    await search()
    expect(await screen.findByRole('alert')).toHaveTextContent('Arama başarısız')
  })
})
