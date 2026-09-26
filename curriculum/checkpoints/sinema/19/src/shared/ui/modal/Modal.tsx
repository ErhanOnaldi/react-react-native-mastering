import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/shared/lib/cn'
import { buttonVariants } from '@/shared/ui/button-variants'
import { useDisclosure } from './useDisclosure'

interface ModalContextValue {
  isOpen: boolean
  open: () => void
  close: () => void
  titleId: string
  /** Tetikleyici DOM öğesini kaydeder (focus'u kapanınca ona geri vermek için). */
  setTrigger: (node: HTMLElement | null) => void
  getTrigger: () => HTMLElement | null
}

const ModalContext = createContext<ModalContextValue | null>(null)

function useModal(part: string) {
  const context = useContext(ModalContext)
  if (!context) throw new Error(`Modal.${part}, <Modal> içinde kullanılmalı.`)
  return context
}

function assignRef<T>(ref: Ref<T> | undefined, node: T | null) {
  if (typeof ref === 'function') ref(node)
  else if (ref) ref.current = node
}

const FOCUSABLE = [
  'a[href]',
  'button',
  'input:not([type="hidden"])',
  'select',
  'textarea',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

/** Focus alabilen kontrolleri o anki DOM'dan bulur; disabled ve gizli olanları atlar. */
function focusableIn(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      !element.matches(':disabled') && !element.closest('[hidden], [inert]'),
  )
}

export function Modal({
  children,
  defaultOpen = false,
}: {
  children: ReactNode
  defaultOpen?: boolean
}) {
  const { isOpen, open, close } = useDisclosure(defaultOpen)
  const titleId = useId()
  const triggerRef = useRef<HTMLElement | null>(null)
  // Content'in effect'i bunlara bağlı: referansları compiler'dan bağımsız olarak sabit kalsın.
  const setTrigger = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
  }, [])
  const getTrigger = useCallback(() => triggerRef.current, [])
  const context: ModalContextValue = {
    isOpen,
    open,
    close,
    titleId,
    setTrigger,
    getTrigger,
  }
  return <ModalContext value={context}>{children}</ModalContext>
}

interface TriggerChildProps {
  onClick?: (event: MouseEvent<HTMLElement>) => void
  ref?: Ref<HTMLElement>
  'aria-haspopup'?: 'dialog'
  'aria-expanded'?: boolean
}

function ModalTrigger({
  asChild = false,
  children,
  onClick,
  ref,
  ...props
}: ComponentProps<'button'> & { asChild?: boolean }) {
  const { isOpen, open, setTrigger } = useModal('Trigger')

  if (asChild) {
    const child = Children.only(children)
    if (!isValidElement<TriggerChildProps>(child))
      throw new Error('Modal.Trigger asChild tek bir React elementi bekler.')
    const childProps = child.props
    return cloneElement(child, {
      'aria-haspopup': 'dialog',
      'aria-expanded': isOpen,
      onClick: (event: MouseEvent<HTMLElement>) => {
        childProps.onClick?.(event)
        if (!event.defaultPrevented) open()
      },
      ref: (node: HTMLElement | null) => {
        setTrigger(node)
        assignRef(childProps.ref, node)
      },
    })
  }

  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      {...props}
      ref={(node) => {
        setTrigger(node)
        assignRef(ref, node)
      }}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) open()
      }}
    >
      {children}
    </button>
  )
}

function ModalContent({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  const { isOpen, close, titleId, getTrigger } = useModal('Content')
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return
    // Safari'de tıklama düğmeye focus vermez; bu yüzden önce kayıtlı tetikleyiciye dönüyoruz.
    const returnTo = getTrigger() ?? document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    ;(focusableIn(dialog)[0] ?? dialog).focus()

    function onKeyDown(event: KeyboardEvent) {
      if (!dialog) return
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusableIn(dialog)
      if (items.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      const outside = active === dialog || !dialog.contains(active)
      if (event.shiftKey && (active === first || outside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || outside)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (returnTo instanceof HTMLElement && returnTo.isConnected)
        returnTo.focus()
    }
  }, [isOpen, close, getTrigger])

  if (!isOpen) return null
  return createPortal(
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-black/60"
        onClick={close}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'fixed top-1/2 left-1/2 z-50 w-[min(32rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-6 text-white shadow-xl focus-visible:outline-2 focus-visible:outline-brand-400',
          className,
        )}
      >
        <h2 id={titleId} className="text-xl font-semibold">
          {title}
        </h2>
        {children}
      </div>
    </>,
    document.body,
  )
}

function ModalClose({
  className,
  onClick,
  ...props
}: ComponentProps<'button'>) {
  const { close } = useModal('Close')
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: 'secondary' }), className)}
      {...props}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) close()
      }}
    />
  )
}

Modal.Trigger = ModalTrigger
Modal.Content = ModalContent
Modal.Close = ModalClose
