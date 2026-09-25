import type { ReactNode } from 'react'
type Props = { children: ReactNode; actions?: ReactNode }
export function MoviePanel({ children, actions }: Props) {
  return <article>{children}</article>
}
