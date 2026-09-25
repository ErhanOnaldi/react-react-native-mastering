import { useState } from 'react'
import type { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}
export function MovieShelf({ title, children, open, defaultOpen, onOpenChange }: Props) {
  const [innerOpen] = useState(defaultOpen ?? false)
  return (
    <section>
      <button type="button" aria-expanded={false}>
        {title}
      </button>
    </section>
  )
}
