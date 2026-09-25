import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi } from 'vitest'
import { RateButton } from '@exercise/RateButton'
function show(rate: (input: { movieId: number; value: number }) => Promise<void>) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <RateButton movieId={550} rate={rate} />
    </QueryClientProvider>,
  )
}
describe('puan butonu', () => {
  it('tıklamada doğru film ve puanı gönderir', async () => {
    const rate = vi.fn(async () => {})
    show(rate)
    expect(rate).not.toHaveBeenCalled()
    await userEvent.setup().click(screen.getByRole('button', { name: '8,5 ver' }))
    expect(rate).toHaveBeenCalledWith({ movieId: 550, value: 8.5 }, expect.anything())
    expect(await screen.findByText('Kaydedildi')).toBeInTheDocument()
  })
  it('beklerken butonu kilitler ve sunucu hatasını gösterir', async () => {
    let reject!: (error: Error) => void
    const rate = vi.fn(
      () =>
        new Promise<void>((_, bad) => {
          reject = bad
        }),
    )
    show(rate)
    await userEvent.setup().click(screen.getByRole('button', { name: '8,5 ver' }))
    expect(screen.getByRole('button', { name: 'Kaydediliyor…' })).toBeDisabled()
    reject(new Error('500'))
    expect(await screen.findByRole('alert')).toHaveTextContent('Puan kaydedilemedi')
  })
})
