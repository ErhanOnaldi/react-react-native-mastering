import { useEffect, useEffectEvent, useId, useRef } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export function FocusDialog({ open, onClose }: Props) {
  const titleId = useId()
  const playRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  // onClose bir olay: güncel halini oku ama effect'i yeniden kurma.
  const handleClose = useEffectEvent(() => onClose())

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    playRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        handleClose()
      } else if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === playRef.current) {
          event.preventDefault()
          closeRef.current?.focus()
        } else if (!event.shiftKey && document.activeElement === closeRef.current) {
          event.preventDefault()
          playRef.current?.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus()
    }
  }, [open])

  if (!open) return null
  return (
    <div role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <h2 id={titleId}>Fragman</h2>
      <button ref={playRef} type="button">
        Oynat
      </button>
      <button ref={closeRef} type="button" onClick={onClose}>
        Kapat
      </button>
    </div>
  )
}
