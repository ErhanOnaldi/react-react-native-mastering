import { useState } from 'react'

export function SearchShell({ onResultsRender }: { onResultsRender: () => void }) {
  const [query, setQuery] = useState('')
  onResultsRender()
  return (
    <section>
      <label>
        Film ara <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p>Arama: {query}</p>
    </section>
  )
}
