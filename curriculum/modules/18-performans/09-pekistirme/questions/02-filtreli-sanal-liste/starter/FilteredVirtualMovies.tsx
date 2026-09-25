export interface Movie {
  id: number
  title: string
}
export function FilteredVirtualMovies({ movies, query }: { movies: Movie[]; query: string }) {
  return (
    <div>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  )
}
