import { useState } from 'react'
import { catalog } from '@test-utils'

export function MovieCatalog() {
  const [query, setQuery] = useState('')
  const [ascending, setAscending] = useState(true)
  const [favoritesByPosition, setFavoritesByPosition] = useState<Record<number, boolean>>({})

  const normalized = query.trim().toLowerCase()
  const filtered = normalized
    ? catalog.filter((movie) => movie.title.toLowerCase().includes(normalized))
    : catalog
  const sorted = [...filtered].sort((a, b) =>
    ascending ? a.title.localeCompare(b.title, 'tr') : b.title.localeCompare(a.title, 'tr'),
  )

  function toggleFavorite(position: number) {
    setFavoritesByPosition((previous) => ({ ...previous, [position]: !previous[position] }))
  }

  return (
    <section>
      <label>
        Film ara <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <button onClick={() => setAscending((value) => !value)}>Sırala</button>
      <ul>
        {sorted.map((movie, position) => (
          <li key={position}>
            {movie.title}{' '}
            <button
              aria-label={`${movie.title} favori`}
              aria-pressed={Boolean(favoritesByPosition[position])}
              onClick={() => toggleFavorite(position)}
            >
              {favoritesByPosition[position] ? '★' : '☆'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
