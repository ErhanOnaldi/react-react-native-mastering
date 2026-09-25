type Movie = { id: number; title: string }
export function MovieList({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) return <p>Film bulunamadı</p>
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
