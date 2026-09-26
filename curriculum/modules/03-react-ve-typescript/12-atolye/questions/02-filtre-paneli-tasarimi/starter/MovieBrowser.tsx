import { useState } from 'react'
import { movies } from './movies'

export function MovieBrowser() {
  const [query, setQuery] = useState('')
  return (
    <section>
      <label>
        Film ara
        <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
      </label>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </section>
  )
}
