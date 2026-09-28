import { useState } from 'react'

const sections = ['Kıyı kasabası', 'Kayıp harita', 'Gece treni']

export function PageReader() {
  const [page, setPage] = useState(1)
  return (
    <main>
      <p>Sayfa {page}</p>
      <h1>{sections[page - 1]}</h1>
      <button onClick={() => setPage((current) => Math.min(current + 1, sections.length))}>
        Sonraki sayfa
      </button>
    </main>
  )
}
