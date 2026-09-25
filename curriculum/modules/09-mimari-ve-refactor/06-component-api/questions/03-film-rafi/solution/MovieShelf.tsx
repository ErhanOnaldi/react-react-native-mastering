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
  const [innerOpen, setInnerOpen] = useState(defaultOpen ?? false)
  const visible = open ?? innerOpen
  function toggle() {
    const next = !visible
    if (open === undefined) setInnerOpen(next)
    onOpenChange?.(next)
  }
  return (
    <section>
      <button type="button" aria-expanded={visible} onClick={toggle}>
        {title}
      </button>
      {visible && children}
    </section>
  )
}
