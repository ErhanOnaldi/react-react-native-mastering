import { useState } from 'react'
const movies = [
  { id: 550, title: 'Dövüş Kulübü' },
  { id: 155, title: 'Kara Şövalye' },
  { id: 603, title: 'Matrix' },
]
export function SearchableMovies() {
  const [query, setQuery] = useState('')
  const visible = movies.filter((movie) =>
    movie.title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr').trim()),
  )
  return (
    <>
      <label>
        Film ara
        <input value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
      </label>
      {visible.length ? (
        <ul>
          {visible.map((movie) => (
            <li key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      ) : (
        <p>Film bulunamadı</p>
      )}
    </>
  )
}
