import type { ReactNode } from 'react'
export function BodyPortal({ children }: { children: ReactNode }) {
  return <section aria-label="Fragman alanı">{children}</section>
}
