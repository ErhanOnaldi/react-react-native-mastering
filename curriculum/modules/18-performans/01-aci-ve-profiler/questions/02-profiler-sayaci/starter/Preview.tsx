import { useRef, useState } from 'react'
import type { ProfilerOnRenderCallback } from 'react'
import { ProfiledMovies } from './ProfiledMovies'
const movies = Array.from({ length: 500 }, (_, index) => `Film ${index + 1}`)
export default function Preview() {
  const [query, setQuery] = useState('')
  const countRef = useRef<HTMLSpanElement>(null)
  const commits = useRef(0)
  const onCommit: ProfilerOnRenderCallback = () => {
    commits.current++
    if (countRef.current) countRef.current.textContent = String(commits.current)
  }
  return (
    <div>
      <label>
        Film ara <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <p>
        Liste commit: <span ref={countRef}>0</span>
      </p>
      <ProfiledMovies
        titles={movies.filter((movie) =>
          movie.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')),
        )}
        onCommit={onCommit}
      />
    </div>
  )
}
