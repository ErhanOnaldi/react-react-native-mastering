import { render, screen } from '@testing-library/react'
import { Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, it, vi } from 'vitest'
import { MovieDetail } from '@exercise/MovieDetail'
it('ilk yüklemede fallback, sonra Türkçe film başlığını gösterir', async () => {
  const load = vi.fn(async (id: number) => ({
    id,
    title: id === 550 ? 'Dövüş Kulübü' : 'Başlangıç',
  }))
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <Suspense fallback={<p>Film yükleniyor…</p>}>
        <MovieDetail id={550} load={load} />
      </Suspense>
    </QueryClientProvider>,
  )
  expect(await screen.findByRole('heading', { name: 'Dövüş Kulübü' })).toBeInTheDocument()
  expect(load).toHaveBeenCalledWith(550)
})
