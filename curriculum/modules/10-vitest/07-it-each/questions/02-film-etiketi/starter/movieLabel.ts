interface MovieLabelInput {
  title: string
  release_date: string
}

export function movieLabel(movie: MovieLabelInput): string {
  return movie.title
}
