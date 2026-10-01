import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
export function renderWithQuery(ui: ReactElement) {
  return render(ui)
}
