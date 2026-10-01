import type { MouseEvent, ReactElement, ReactNode, Ref } from 'react'
interface Props {
  asChild?: boolean
  onOpen: () => void
  children: ReactNode
  ref?: Ref<HTMLElement>
  className?: string
  'aria-label'?: string
}
export function SlotTrigger({
  asChild,
  onOpen,
  children,
  ref,
  className,
  'aria-label': label,
}: Props) {
  return (
    <button type="button" className={className} aria-label={label} onClick={onOpen}>
      {children}
    </button>
  )
}
