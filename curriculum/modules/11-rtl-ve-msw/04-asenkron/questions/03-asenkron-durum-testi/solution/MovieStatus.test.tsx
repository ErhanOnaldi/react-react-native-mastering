import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { server, http, HttpResponse, delay, TMDB_BASE } from '@test-utils'
import { MovieStatus } from '@impl/MovieStatus'
describe('MovieStatus', () => {
  it('istek boyunca loading, sonra başlık gösterir', async () => {
    server.use(
      http.get(`${TMDB_BASE}/movie/550`, async () => {
        await delay(80)
        return HttpResponse.json({ title: 'Dövüş Kulübü' })
      }),
    )
    render(<MovieStatus id={550} />)
    expect(screen.getByRole('status')).toHaveTextContent('Yükleniyor')
    expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
  })
  it('sunucu hatasını kullanıcıya gösterir', async () => {
    server.use(
      http.get(`${TMDB_BASE}/movie/550`, () =>
        HttpResponse.json({ status_message: 'Hata' }, { status: 500 }),
      ),
    )
    render(<MovieStatus id={550} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Film yüklenemedi')
  })
})
