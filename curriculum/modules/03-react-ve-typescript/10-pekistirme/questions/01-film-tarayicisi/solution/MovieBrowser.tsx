import { useState } from 'react'
const movies = [
  { id: 550, title: 'Dövüş Kulübü' },
  { id: 155, title: 'Kara Şövalye' },
  { id: 603, title: 'Matrix' },
]
export function MovieBrowser() {
  const [query, setQuery] = useState('')
  const [favorites, setFavorites] = useState<number[]>([])
  const visible = movies.filter((movie) =>
    movie.title.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr').trim()),
  )
  function toggle(id: number) {
    setFavorites((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]))
  }
  return (
    <>
      <label>
        Film ara
        <input value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
      </label>
      {visible.length ? (
        <ul>
          {visible.map((movie) => (
            <li key={movie.id}>
              {movie.title}{' '}
              <button aria-pressed={favorites.includes(movie.id)} onClick={() => toggle(movie.id)}>
                {movie.title} {favorites.includes(movie.id) ? 'Favoriden çıkar' : 'Favoriye ekle'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Film bulunamadı</p>
      )}
    </>
  )
}
