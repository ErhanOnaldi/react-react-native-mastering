interface MovieLabelInput {
  title: string
  release_date: string
}

export function movieLabel(movie: MovieLabelInput): string {
  if (!movie.release_date) return movie.title
  return `${movie.title} (${movie.release_date.slice(0, 4)})`
}
