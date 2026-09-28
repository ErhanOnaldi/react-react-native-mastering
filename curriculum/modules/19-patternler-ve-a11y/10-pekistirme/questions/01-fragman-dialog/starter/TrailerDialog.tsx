import { useState } from 'react'

export function TrailerDialog({ movieTitle }: { movieTitle: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Fragmanı aç
      </button>
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgb(0 0 0 / 0.6)' }}
          onClick={() => setOpen(false)}
        >
          <div style={{ background: 'white', color: 'black', margin: '10vh auto', padding: 24, maxWidth: 360 }}>
            <h2>{movieTitle} fragmanı</h2>
            <button type="button">Oynat</button>
            <button type="button" onClick={() => setOpen(false)}>
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  )
}
