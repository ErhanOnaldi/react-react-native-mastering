import type { ReactNode } from 'react'
export function PosterFrame({
  children,
  caption = 'Afiş yok',
}: {
  children: ReactNode
  caption?: string
}) {
  return <figure>{children}</figure>
}
