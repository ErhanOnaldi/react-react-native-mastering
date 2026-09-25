type Movie = { title: string; overview: string; poster_path: string | null }
export function MovieSummary({ movie }: { movie: Movie }) {
  if (movie.poster_path) {
    return (
      <article>
        <img src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`} alt={movie.title} />
        <h2>{movie.title}</h2>
        <p>{movie.overview}</p>
      </article>
    )
  }
  return (
    <article>
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
    </article>
  )
}
