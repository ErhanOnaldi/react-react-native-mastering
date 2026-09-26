import { useState } from 'react'
import { movies } from './movies'

export function MovieShelf() {
  const [reversed, setReversed] = useState(false)
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const ordered = [...movies].sort((a, b) => a.title.localeCompare(b.title, 'tr'))
  if (reversed) ordered.reverse()

  function toggleFavorite(id: number) {
    setFavoriteIds((ids) => (ids.includes(id) ? ids.filter((item) => item !== id) : [...ids, id]))
  }

  return (
    <section>
      <button onClick={() => setReversed((value) => !value)}>Sıralamayı ters çevir</button>
      <ul>
        {ordered.map((movie) => (
          <li key={movie.id}>
            {movie.title}{' '}
            <button
              aria-label={`${movie.title} favori`}
              aria-pressed={favoriteIds.includes(movie.id)}
              onClick={() => toggleFavorite(movie.id)}
            >
              Favori
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
