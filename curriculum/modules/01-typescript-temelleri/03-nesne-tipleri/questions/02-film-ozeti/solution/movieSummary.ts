export interface MovieSummary {
  readonly id: number
  title: string
  poster_path: string | null
  tagline?: string
}

export function summary(movie: MovieSummary): string {
  return movie.tagline ? `${movie.title} — ${movie.tagline}` : movie.title
}
