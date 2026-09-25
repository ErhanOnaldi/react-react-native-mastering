import { Movie } from './types'

/** "1999-10-15" → "1999", boş tarihte "" */
export function releaseYear(movie: Movie): string {
  return movie.release_date.slice(0, 4)
}

/** 7.5 ve üstü: "Çok iyi" */
export function isHighlyRated(score) {
  return score >= 7.5
}

/** Listeden id ile film adını bulur; bulunamazsa "Bilinmeyen film" */
export function titleById(movies: Movie[], id: number): string {
  const movie = movies.find((m) => m.id === id)
  return movie.title
}
