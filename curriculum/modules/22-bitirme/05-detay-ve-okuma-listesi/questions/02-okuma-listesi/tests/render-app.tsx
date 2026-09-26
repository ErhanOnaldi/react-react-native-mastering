// Kitaplık'ı verilen adreste, sözleşmedeki iki export ile render eder:
// src/app/routes.tsx → createRoutes(queryClient) · src/app/providers.tsx → AppProviders
import { QueryClient } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { vi } from 'vitest'

/**
 * Uygulamayı "sayfa yeniden açılmış gibi" yükler: projenin modülleri sıfırdan çalışır.
 * Böylece modül seviyesindeki bir store bile testler arasında durum taşıyamaz;
 * liste ancak gerçekten kalıcıysa (localStorage) geri gelir.
 */
export async function openApp(url = '/') {
  vi.resetModules()
  const [{ createRoutes }, { AppProviders }] = await Promise.all([
    import('@project/src/app/routes'),
    import('@project/src/app/providers'),
  ])
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const router = createMemoryRouter(createRoutes(queryClient), { initialEntries: [url] })
  const user = userEvent.setup()
  const view = render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return { router, user, unmount: view.unmount }
}

/** Detay sayfası yüklenene kadar bekler (h1 = eser adı) */
export async function waitForWork(title: string) {
  return screen.findByRole('heading', { level: 1, name: title })
}

/** Menüdeki "Okuma listem (n)" linki */
export function readingListLink(count: number) {
  return screen.getByRole('link', { name: new RegExp(`okuma listem\\s*\\(${count}\\)`, 'i') })
}
