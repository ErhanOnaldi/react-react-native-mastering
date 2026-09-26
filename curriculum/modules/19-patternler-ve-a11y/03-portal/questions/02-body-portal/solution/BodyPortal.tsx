import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
export function BodyPortal({ children }: { children: ReactNode }) {
  return createPortal(<section aria-label="Fragman alanı">{children}</section>, document.body)
}
