import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, it, vi } from 'vitest'
import { DeleteRatingButton } from '@exercise/DeleteRatingButton'
function show(remove: (movieId: number) => Promise<void>) {
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } })
  render(
    <QueryClientProvider client={client}>
      <DeleteRatingButton movieId={550} remove={remove} />
    </QueryClientProvider>,
  )
}
it('silme çağrısını tıklamayla başlatıp bekleme ve başarıyı gösterir', async () => {
  let finish!: () => void
  const remove = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve
      }),
  )
  show(remove)
  expect(remove).not.toHaveBeenCalled()
  await userEvent.setup().click(screen.getByRole('button', { name: 'Puanı sil' }))
  expect(remove).toHaveBeenCalledWith(550)
  expect(screen.getByRole('button', { name: 'Siliniyor…' })).toBeDisabled()
  finish()
  expect(await screen.findByText('Puan silindi')).toBeInTheDocument()
})
it('silme hatasını kullanıcıya gösterir', async () => {
  show(
    vi.fn(async () => {
      throw new Error('500')
    }),
  )
  await userEvent.setup().click(screen.getByRole('button', { name: 'Puanı sil' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Puan silinemedi')
})
