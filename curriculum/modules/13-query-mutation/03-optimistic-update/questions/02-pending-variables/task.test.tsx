import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, it } from 'vitest'
import { PendingRating } from '@exercise/PendingRating'
it('500 gelene dek geçici puanı gösterir, sonra geri alır', async () => {
  let reject!: (e: Error) => void
  const rate = () =>
    new Promise<void>((_, bad) => {
      reject = bad
    })
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}
    >
      <PendingRating movieId={550} rate={rate} />
    </QueryClientProvider>,
  )
  await userEvent.setup().click(screen.getByRole('button', { name: '8,5 ver' }))
  expect(screen.getByText('8,5 gönderiliyor')).toBeInTheDocument()
  reject(new Error('500'))
  expect(await screen.findByRole('alert')).toHaveTextContent('Kaydedilemedi')
  expect(screen.queryByText('8,5 gönderiliyor')).not.toBeInTheDocument()
})
