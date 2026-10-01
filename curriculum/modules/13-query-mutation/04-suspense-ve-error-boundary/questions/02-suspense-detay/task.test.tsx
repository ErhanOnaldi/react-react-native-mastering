import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, it, vi } from 'vitest'
import { MovieDetail } from '@exercise/MovieDetail'
function show(load: (id: number) => Promise<{ id: number; title: string }>) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={client}>
      <MovieDetail id={550} load={load} />
    </QueryClientProvider>,
  )
}
it('beklerken fallback, sonra film başlığını gösterir', async () => {
  let finish!: (movie: { id: number; title: string }) => void
  const load = vi.fn(
    () =>
      new Promise<{ id: number; title: string }>((resolve) => {
        finish = resolve
      }),
  )
  show(load)
  expect(screen.getByText('Film yükleniyor…')).toBeInTheDocument()
  finish({ id: 550, title: 'Dövüş Kulübü' })
  expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
})
it('reddedilen isteği hata sınırı gösterir', async () => {
  show(
    vi.fn(async () => {
      throw new Error('500')
    }),
  )
  expect(await screen.findByRole('alert')).toHaveTextContent('Film yüklenemedi')
})
