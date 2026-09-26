import { useMemo, useState } from 'react'
import { catalog } from '@test-utils'

export function MovieCatalog() {
  const [query, setQuery] = useState('')
  const [ascending, setAscending] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(() => new Set())

  const sorted = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const filtered = normalized
      ? catalog.filter((movie) => movie.title.toLowerCase().includes(normalized))
      : catalog
    return [...filtered].sort((a, b) =>
      ascending ? a.title.localeCompare(b.title, 'tr') : b.title.localeCompare(a.title, 'tr'),
    )
  }, [query, ascending])

  function toggleFavorite(id: number) {
    setFavoriteIds((previous) => {
      const next = new Set(previous)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section>
      <label>
        Film ara <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <button onClick={() => setAscending((value) => !value)}>Sırala</button>
      <ul>
        {sorted.map((movie) => (
          <li key={movie.id}>
            {movie.title}{' '}
            <button
              aria-label={`${movie.title} favori`}
              aria-pressed={favoriteIds.has(movie.id)}
              onClick={() => toggleFavorite(movie.id)}
            >
              {favoriteIds.has(movie.id) ? '★' : '☆'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
