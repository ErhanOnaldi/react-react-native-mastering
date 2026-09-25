import { useState } from 'react'
const movies = [
  { id: 550, title: 'Dövüş Kulübü' },
  { id: 155, title: 'Kara Şövalye' },
]
export function FavoriteShelf() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  function toggle(id: number) {
    setFavoriteIds((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]))
  }
  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          {movie.title}{' '}
          <button aria-pressed={favoriteIds.includes(movie.id)} onClick={() => toggle(movie.id)}>
            {movie.title} {favoriteIds.includes(movie.id) ? 'Favoriden çıkar' : 'Favoriye ekle'}
          </button>
        </li>
      ))}
    </ul>
  )
}
