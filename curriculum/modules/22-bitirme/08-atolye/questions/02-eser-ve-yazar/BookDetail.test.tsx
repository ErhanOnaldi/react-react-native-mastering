import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { BookDetail } from '@exercise/BookDetail'

function renderAt(initialEntry: string): ReturnType<typeof createMemoryRouter> {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter([{ path: '/books/:workId', element: <BookDetail /> }], {
    initialEntries: [initialEntry],
  })
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

describe('eser ve yazar', () => {
  it('eser değişince yazar da yeni esere göre güncellenir', async () => {
    const router = renderAt('/books/OL893414W')
    expect(await screen.findByText('Dune')).toBeInTheDocument()
    expect(await screen.findByText('Yazar: Frank Herbert')).toBeInTheDocument()

    await router.navigate('/books/OL24252290W')
    expect(await screen.findByText('Suç ve Ceza')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Yazar: Yazar bulunamadı')).toBeInTheDocument())
  })

  it('geri dönünce önceki esere ait doğru yazarı gösterir', async () => {
    const router = renderAt('/books/OL893414W')
    expect(await screen.findByText('Yazar: Frank Herbert')).toBeInTheDocument()

    await router.navigate('/books/OL24252290W')
    await waitFor(() => expect(screen.getByText('Yazar: Yazar bulunamadı')).toBeInTheDocument())

    await router.navigate(-1)
    expect(await screen.findByText('Dune')).toBeInTheDocument()
    await waitFor(() => expect(screen.getByText('Yazar: Frank Herbert')).toBeInTheDocument())
  })
})
