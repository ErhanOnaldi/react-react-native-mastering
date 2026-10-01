import type { Movie } from './movie'

// Film kartı yalnızca bu dört alanı kullanıyor.
export type MovieCardData = {
  id: number
  title: string
  poster_path: string
  vote_average: number
}

export function cardLine(movie: MovieCardData): string {
  return `${movie.title} · ${movie.vote_average.toFixed(1)}`
}

export function cardLines(movies: Movie[]): string[] {
  return movies.map(cardLine)
}
