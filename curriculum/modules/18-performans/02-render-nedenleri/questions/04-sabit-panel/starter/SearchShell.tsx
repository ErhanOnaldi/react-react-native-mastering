import { useState } from 'react'

function ResultsPanel({ onRender }: { onRender: () => void }) {
  onRender()
  return <p>Film sonuçları hazır</p>
}

export function SearchShell({ onResultsRender }: { onResultsRender: () => void }) {
  const [query, setQuery] = useState('')
  return (
    <section>
      <label>
        Film ara <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p>Arama: {query}</p>
      <ResultsPanel onRender={onResultsRender} />
    </section>
  )
}
