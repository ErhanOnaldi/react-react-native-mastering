import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createMemoryRouter, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'

export function renderWithRouter(
  ui: ReactNode | RouteObject[],
  { route = '/' }: { route?: string } = {},
) {
  const routes: RouteObject[] = Array.isArray(ui)
    ? ui
    : [{ path: '*', element: ui }]
  const router = createMemoryRouter(routes, { initialEntries: [route] })
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return {
    router,
    client,
    ...render(
      <QueryClientProvider client={client}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  }
}
