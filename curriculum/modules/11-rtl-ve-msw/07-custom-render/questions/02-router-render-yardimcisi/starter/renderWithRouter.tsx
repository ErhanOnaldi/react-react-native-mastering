import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { createMemoryRouter } from 'react-router'

export function renderWithRouter(
  ui: ReactNode,
  options: { path: string; route: string },
): ReturnType<typeof render> & { router: ReturnType<typeof createMemoryRouter> } {
  void ui
  void options
  throw new Error('TODO')
}
