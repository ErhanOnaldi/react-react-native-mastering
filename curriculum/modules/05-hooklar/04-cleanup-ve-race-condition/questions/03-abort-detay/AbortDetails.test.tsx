import { render, screen, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { server, http, HttpResponse, TMDB_BASE, delay } from '@test-utils'
import { AbortDetails } from '@exercise/AbortDetails'
describe('AbortDetails', () => {
  it('id değişince önceki fetch sinyalini iptal eder', async () => {
    let oldSignal: AbortSignal | undefined
    server.use(
      http.get(`${TMDB_BASE}/movie/:id`, async ({ request, params }) => {
        if (params.id === '550') {
          oldSignal = request.signal
          await delay(90)
        } else await delay(5)
        return HttpResponse.json({ title: params.id === '550' ? 'Dövüş Kulübü' : 'Başlangıç' })
      }),
    )
    const view = render(<AbortDetails id={550} />)
    view.rerender(<AbortDetails id={27205} />)
    expect(await screen.findByText('Başlangıç')).toBeInTheDocument()
    expect(oldSignal?.aborted).toBe(true)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 110))
    })
    expect(screen.getByText('Başlangıç')).toBeInTheDocument()
  })
})
