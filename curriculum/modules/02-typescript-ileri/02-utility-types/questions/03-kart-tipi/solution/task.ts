import type { Movie } from './movie'

// Film kartı yalnızca bu dört alanı kullanıyor.
export type MovieCardData = Pick<Movie, 'id' | 'title' | 'poster_path' | 'vote_average'>

export function cardLine(movie: MovieCardData): string {
  const line = `${movie.title} · ${movie.vote_average.toFixed(1)}`
  return movie.poster_path === null ? `${line} · poster yok` : line
}

export function cardLines(movies: Movie[]): string[] {
  return movies.map(cardLine)
}
