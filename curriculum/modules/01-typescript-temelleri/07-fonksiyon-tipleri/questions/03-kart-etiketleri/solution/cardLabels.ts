export type MovieLabelInput = { title: string; release_date: string }

export function cardLabels(movies: MovieLabelInput[], fallback = 'Tarih yok'): string[] {
  return movies.map(
    (movie) =>
      `${movie.title} · ${movie.release_date === '' ? fallback : movie.release_date.slice(0, 4)}`,
  )
}
