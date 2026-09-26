import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { createPortal } from 'react-dom'

export function TrailerDialog({ movieTitle }: { movieTitle: string }) {
  const [open, setOpen] = useState(false)
  const titleId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const playRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const trigger = triggerRef.current
    playRef.current?.focus()

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
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
      trigger?.focus()
    }
  }, [open])

  function onBackdropClick(event: MouseEvent<HTMLDivElement>) {
    // Dialogun içinden kabarcıklanan tıklamalar da buraya gelir; yalnızca arka planın kendisi kapatır.
    if (event.target === event.currentTarget) setOpen(false)
  }

  return (
    <>
      <button ref={triggerRef} type="button" onClick={() => setOpen(true)}>
        Fragmanı aç
      </button>
      {open &&
        createPortal(
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgb(0 0 0 / 0.6)' }}
            onClick={onBackdropClick}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              style={{ background: 'white', color: 'black', margin: '10vh auto', padding: 24, maxWidth: 360 }}
            >
              <h2 id={titleId}>{movieTitle} fragmanı</h2>
              <button ref={playRef} type="button">
                Oynat
              </button>
              <button ref={closeRef} type="button" onClick={() => setOpen(false)}>
                Kapat
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  )
}
