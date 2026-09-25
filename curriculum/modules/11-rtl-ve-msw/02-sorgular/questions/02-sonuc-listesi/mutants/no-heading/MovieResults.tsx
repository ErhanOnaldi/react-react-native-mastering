interface Movie {
  id: number
  title: string
}
export function MovieResults({ movies }: { movies: Movie[] }) {
  if (movies.length === 0) return <p role="status">Film bulunamadı</p>
  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <span>{movie.title}</span>
        </li>
      ))}
    </ul>
  )
}
