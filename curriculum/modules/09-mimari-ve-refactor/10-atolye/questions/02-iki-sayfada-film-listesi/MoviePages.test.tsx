import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse, server, TMDB_BASE } from '@test-utils'
import { MoviePages } from '@exercise/MoviePages'

describe('iki film ekranı', () => {
  it('popüler listeyi korur ve aramada aynı başlık görünümünü kullanır', async () => {
    const user = userEvent.setup()
    render(<MoviePages />)
    expect((await screen.findAllByRole('listitem')).length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Arama' }))
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'Dövüş')
    expect(await screen.findByText('Dövüş Kulübü')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Popüler' }))
    expect((await screen.findAllByRole('listitem')).length).toBeGreaterThan(0)
  })
  it('arama boş ve hata cevaplarını kullanıcıya gösterir', async () => {
    const user = userEvent.setup()
    server.use(
      http.get(`${TMDB_BASE}/search/movie`, ({ request }) =>
        new URL(request.url).searchParams.get('query') === 'hata'
          ? HttpResponse.json({}, { status: 500 })
          : HttpResponse.json({ results: [] }),
      ),
    )
    render(<MoviePages />)
    await user.click(screen.getByRole('button', { name: 'Arama' }))
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'yok')
    expect(await screen.findByText('Film bulunamadı')).toBeInTheDocument()
    await user.clear(screen.getByRole('textbox', { name: 'Film ara' }))
    await user.type(screen.getByRole('textbox', { name: 'Film ara' }), 'hata')
    expect(await screen.findByRole('alert')).toHaveTextContent('yüklenemedi')
  })
})
