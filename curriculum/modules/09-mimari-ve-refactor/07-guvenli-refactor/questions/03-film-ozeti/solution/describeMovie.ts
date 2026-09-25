import { formatMovieYear } from './formatMovieYear'

type Movie = { title: string; release_date: string }
type Kind = 'trending' | 'favorite' | 'search'

export function describeMovie(movie: Movie, kind: Kind): string {
  const labels: Record<Kind, string> = { trending: 'Trend', favorite: 'Favori', search: 'Arama' }
  const year = formatMovieYear(movie.release_date)
  return `${labels[kind]} · ${movie.title} · ${year}`
}
