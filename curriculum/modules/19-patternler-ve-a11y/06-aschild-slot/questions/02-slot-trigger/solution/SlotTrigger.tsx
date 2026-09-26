import { Children, cloneElement, isValidElement } from 'react'
import type { MouseEvent, ReactNode, Ref } from 'react'
type ChildProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void
  className?: string
  'aria-label'?: string
  ref?: Ref<HTMLElement>
}
interface Props {
  asChild?: boolean
  onOpen: () => void
  children: ReactNode
  ref?: Ref<HTMLElement>
  className?: string
  'aria-label'?: string
}
function assignRef(ref: Ref<HTMLElement> | undefined, node: HTMLElement | null) {
  if (typeof ref === 'function') ref(node)
  else if (ref) ref.current = node
}
export function SlotTrigger({
  asChild = false,
  onOpen,
  children,
  ref,
  className,
  'aria-label': label,
}: Props) {
  if (!asChild)
    return (
      <button
        type="button"
        ref={ref as Ref<HTMLButtonElement>}
        className={className}
        aria-label={label}
        onClick={onOpen}
      >
        {children}
      </button>
    )
  const only = Children.only(children)
  if (!isValidElement<ChildProps>(only)) throw new Error('asChild tek bir React element ister')
  const child = only.props
  return cloneElement(only, {
    className: [className, child.className].filter(Boolean).join(' '),
    'aria-label': child['aria-label'] ?? label,
    onClick: (event: MouseEvent<HTMLElement>) => {
      child.onClick?.(event)
      if (!event.defaultPrevented) onOpen()
    },
    ref: (node: HTMLElement | null) => {
      assignRef(child.ref, node)
      assignRef(ref, node)
    },
  })
}
