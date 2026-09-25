import { MoviePoster } from './MoviePoster'

type Movie = { title: string; overview: string; poster_path: string | null }
export function MovieSummary({ movie }: { movie: Movie }) {
  return (
    <article>
      <MoviePoster title={movie.title} path={movie.poster_path} />
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
    </article>
  )
}
