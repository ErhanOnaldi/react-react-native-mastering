import type { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
}
export function MovieShelf({ title, children, open, onOpenChange }: Props) {
  function toggle() {
    onOpenChange(!open)
  }
  return (
    <section>
      <button type="button" aria-expanded={open} onClick={toggle}>
        {title}
      </button>
      {open && children}
    </section>
  )
}
