export interface Movie {
  id: number
  title: string
}
export function VirtualMovies({ movies }: { movies: Movie[] }) {
  return (
    <div style={{ height: 240, overflow: 'auto' }}>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </div>
  )
}
