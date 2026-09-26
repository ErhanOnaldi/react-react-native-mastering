import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { http, HttpResponse, requests, server, TMDB_BASE } from '@test-utils'
import { MovieDetail } from '@exercise/MovieDetail'

describe('detay hata akışı', () => {
  it('500 sonrası yükleme biter; yeniden deneme güncel filmi getirir', async () => {
    const user = userEvent.setup()
    let fails = true
    server.use(
      http.get(`${TMDB_BASE}/movie/:id`, () =>
        fails
          ? HttpResponse.json({}, { status: 500 })
          : HttpResponse.json({ title: 'Dövüş Kulübü' }),
      ),
    )
    render(<MovieDetail id={550} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('yüklenemedi')
    expect(screen.queryByText('Yükleniyor')).not.toBeInTheDocument()
    fails = false
    await user.click(screen.getByRole('button', { name: 'Yeniden dene' }))
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
    expect(requests('/3/movie/550')).toHaveLength(2)
  })
  it('film değişince eski hata kaybolur ve yeni detay görünür', async () => {
    server.use(
      http.get(`${TMDB_BASE}/movie/:id`, ({ params }) =>
        params.id === '550'
          ? HttpResponse.json({}, { status: 500 })
          : HttpResponse.json({ title: 'Başlangıç' }),
      ),
    )
    const view = render(<MovieDetail id={550} />)
    await screen.findByRole('alert')
    view.rerender(<MovieDetail id={27205} />)
    expect(await screen.findByRole('heading', { name: 'Başlangıç' })).toBeInTheDocument()
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })
})
