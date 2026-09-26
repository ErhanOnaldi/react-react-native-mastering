import { QueryClient } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AppProviders } from '@/app/providers'
import { createRoutes } from '@/app/routes'

/** Uygulamanın tamamını verilen URL'de render eder. Her çağrı taze bir QueryClient kullanır. */
export function renderApp(url = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  })
  const router = createMemoryRouter(createRoutes(queryClient), { initialEntries: [url] })
  const user = userEvent.setup()
  const view = render(
    <AppProviders queryClient={queryClient}>
      <RouterProvider router={router} />
    </AppProviders>,
  )
  return { ...view, router, user, queryClient }
}
