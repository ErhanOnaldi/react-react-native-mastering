import { useState } from 'react'
import { movies } from './movies'

export function MovieSummary() {
  const [selectedId, setSelectedId] = useState(550)
  const selected = movies.find((movie) => movie.id === selectedId)

  return (
    <section>
      <div>
        {movies.map((movie) => (
          <button
            key={movie.id}
            aria-pressed={selectedId === movie.id}
            onClick={() => setSelectedId(movie.id)}
          >
            {movie.title}
          </button>
        ))}
      </div>
      <p aria-label="Film özeti">
        {selected ? `${selected.title}: ${selected.runtime} dakika` : 'Film seçilmedi'}
      </p>
    </section>
  )
}
