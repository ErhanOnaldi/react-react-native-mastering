import { useState } from 'react'

export function MovieSearchPage() {
  const [query, setQuery] = useState('')

  return (
    <main>
      <label>
        Arama
        <input
          aria-label="Arama"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      <p>Sonuç yok</p>
    </main>
  )
}
