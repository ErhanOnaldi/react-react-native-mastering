interface MovieLabelInput {
  title: string
  release_date: string
}

export function movieLabel(movie: MovieLabelInput): string {
  const title = movie.title.trim()
  if (!movie.release_date) return title
  return `${title} (${movie.release_date.slice(0, 4)})`
}
