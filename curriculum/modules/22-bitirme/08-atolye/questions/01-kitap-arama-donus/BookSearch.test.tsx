import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { describe, expect, it } from 'vitest'
import { requests } from '@test-utils'
import { BookSearch } from '@exercise/BookSearch'

function renderAt(initialEntry: string): ReturnType<typeof createMemoryRouter> {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter([{ path: '/search', element: <BookSearch /> }], {
    initialEntries: [initialEntry],
  })
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
  return router
}

describe('kitap arama', () => {
  it('sayfa değiştirir, geri dönünce önceki sonucu tekrar ağdan istemez', async () => {
    const user = userEvent.setup()
    const router = renderAt('/search?q=Dune&page=1')
    expect(await screen.findByText('Dune')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Sonraki sayfa' }))
    expect(await screen.findByText('Dune Messiah')).toBeInTheDocument()
    await waitFor(() => expect(requests('/search.json').length).toBeGreaterThanOrEqual(2))
    const isteklerIkinciSayfadan = requests('/search.json').length

    await router.navigate(-1)
    expect(await screen.findByText('Dune')).toBeInTheDocument()
    expect(requests('/search.json')).toHaveLength(isteklerIkinciSayfadan)
  })

  it('arayınca yeni sorguyu adres çubuğuna yazar ve sonucu gösterir', async () => {
    const user = userEvent.setup()
    renderAt('/search')
    await user.type(screen.getByRole('textbox', { name: 'Kitap ara' }), 'Dune')
    await user.click(screen.getByRole('button', { name: 'Ara' }))
    expect(await screen.findByText('Dune')).toBeInTheDocument()
  })

  it('sonuç bulunamayınca anlaşılır bir mesaj gösterir', async () => {
    renderAt('/search?q=zzzznotfound&page=1')
    expect(await screen.findByText('Kitap bulunamadı')).toBeInTheDocument()
  })
})
