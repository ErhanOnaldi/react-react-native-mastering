import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
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
  return { router, ...render(<RouterProvider router={router} />) }
}
