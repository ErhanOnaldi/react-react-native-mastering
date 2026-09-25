interface Movie {
  id: number
  title: string
}
export function MovieResults({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) return <p role="status">Liste boş</p>
  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <h2>{movie.title}</h2>
        </li>
      ))}
    </ul>
  )
}
