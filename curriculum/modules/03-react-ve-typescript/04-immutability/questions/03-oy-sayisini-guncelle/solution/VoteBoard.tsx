import { useState } from 'react'
const initial = [
  { id: 550, title: 'Dövüş Kulübü', vote_count: 100 },
  { id: 603, title: 'Matrix', vote_count: 50 },
]
export function VoteBoard() {
  const [movies, setMovies] = useState(initial)
  function vote(id: number) {
    setMovies((items) =>
      items.map((movie) =>
        movie.id === id ? { ...movie, vote_count: movie.vote_count + 1 } : movie,
      ),
    )
  }
  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          {movie.title}: {movie.vote_count} oy{' '}
          <button onClick={() => vote(movie.id)}>Oy ver: {movie.title}</button>
        </li>
      ))}
    </ul>
  )
}
