export function formatMovieYear(releaseDate: string): string {
  return releaseDate ? releaseDate.slice(0, 4) : 'Tarih yok'
}
