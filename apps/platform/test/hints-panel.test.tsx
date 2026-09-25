import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { HintsPanel } from '@/features/question/hints-panel'
import { renderWithProviders } from './render'
import { server } from './server'

describe('HintsPanel', () => {
  it('ipuçlarını tek tek açar', async () => {
    const user = userEvent.setup()
    const hints = ['<p>Birinci</p>', '<p>İkinci</p>']
    server.use(
      http.get('/api/questions/1.1.1/hints', ({ request }) => {
        const count = Number(new URL(request.url).searchParams.get('count'))
        return HttpResponse.json({ hints: hints.slice(0, count), total: 2 })
      }),
    )
    renderWithProviders(<HintsPanel code="1.1.1" total={2} used={0} />)

    await user.click(screen.getByRole('button', { name: /İlk ipucunu göster/ }))
    expect(await screen.findByText('Birinci')).toBeInTheDocument()
    expect(screen.queryByText('İkinci')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /Bir sonraki ipucu/ }))
    expect(await screen.findByText('İkinci')).toBeInTheDocument()
    expect(screen.getByText('Tüm ipuçları açıldı.')).toBeInTheDocument()
  })

  it('ipucu yoksa bunu söyler', () => {
    renderWithProviders(<HintsPanel code="1.1.1" total={0} used={0} />)
    expect(screen.getByText(/ipucu yok/)).toBeInTheDocument()
  })
})
