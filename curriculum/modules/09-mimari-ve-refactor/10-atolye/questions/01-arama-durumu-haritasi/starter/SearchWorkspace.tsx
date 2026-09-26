import { useState } from 'react'

export function SearchWorkspace() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  return (
    <main>
      <label>
        Arama <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <button onClick={() => setOpen(!open)}>Bilgi</button>
      {open && <p>Arama bilgisi</p>}
      <p>Sonuç yok</p>
    </main>
  )
}
