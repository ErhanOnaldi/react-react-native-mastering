import type { ReactNode } from 'react'
type Props = { children: ReactNode; actions?: ReactNode }
export function MoviePanel({ children, actions }: Props) {
  return (
    <article>
      <div>{children}</div>
      {actions == null ? null : <footer>{actions}</footer>}
    </article>
  )
}
