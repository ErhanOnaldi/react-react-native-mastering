// Kitaplık'ı verilen adreste, sözleşmedeki iki export ile render eder:
// src/app/routes.tsx → createRoutes(queryClient) · src/app/providers.tsx → AppProviders
import { QueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AppProviders } from '@project/src/app/providers'
import { createRoutes } from '@project/src/app/routes'

export function renderApp(url = '/') {
  // Testler tekrar denemeyi kapatır: hata durumu hemen görünsün
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter(createRoutes(queryClient), { initialEntries: [url] })
  const user = userEvent.setup()
  render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return { router, user, queryClient }
}

/** URL'deki arama parametreleri */
export function currentParams(router: { state: { location: { search: string } } }) {
  return new URLSearchParams(router.state.location.search)
}

/** `<input type="search">` → searchbox, `<input type="text">` → textbox: ikisi de kabul */
export function searchInput() {
  return (
    screen.queryByRole('searchbox', { name: 'Kitap ara' }) ??
    screen.getByRole('textbox', { name: 'Kitap ara' })
  )
}

/** "Önceki"/"Sonraki": link ya da buton olabilir */
export function pageControl(name: 'Önceki' | 'Sonraki') {
  return screen.queryByRole('link', { name }) ?? screen.queryByRole('button', { name }) ?? null
}

/** Kontrol yoksa, disabled ise ya da aria-disabled="true" ise pasif sayılır */
export function isInactive(control: HTMLElement | null) {
  if (control === null) return true
  if (control instanceof HTMLButtonElement && control.disabled) return true
  return control.getAttribute('aria-disabled') === 'true'
}

/** Eser detayına giden linkin bulunduğu liste öğesi */
export function resultItem(workId: string) {
  const link = screen
    .getAllByRole('link')
    .find((a) => a.getAttribute('href') === `/works/${workId}`)
  if (!link) throw new Error(`/works/${workId} adresine giden bir link yok`)
  const item = link.closest('li')
  if (!item) throw new Error('Sonuçlar bir liste (<ul>/<ol> içinde <li>) olarak gösterilmeli')
  return item
}
