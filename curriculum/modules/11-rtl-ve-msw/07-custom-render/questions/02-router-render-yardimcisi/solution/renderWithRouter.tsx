import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
export function renderWithRouter(ui: ReactNode, options: { path: string; route: string }) {
  const router = createMemoryRouter([{ path: options.path, element: ui }], {
    initialEntries: [options.route],
  })
  return { router, ...render(<RouterProvider router={router} />) }
}
