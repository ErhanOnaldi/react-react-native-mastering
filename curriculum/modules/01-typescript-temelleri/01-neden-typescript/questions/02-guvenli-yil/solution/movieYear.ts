export function movieYear(movie: { release_date: string }): string {
  if (movie.release_date === '') return 'Tarih yok'
  return movie.release_date.slice(0, 4)
}
