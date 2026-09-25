type Movie = { title: string; release_date: string }
type Kind = 'trending' | 'favorite' | 'search'

export function describeMovie(movie: Movie, kind: Kind): string {
  if (kind === 'trending') {
    const year = movie.release_date ? movie.release_date.slice(0, 4) : 'Tarih yok'
    return `Trend · ${movie.title} · ${year}`
  }
  if (kind === 'favorite') {
    const year = movie.release_date ? movie.release_date.slice(0, 4) : 'Tarih yok'
    return `Favori · ${movie.title} · ${year}`
  }
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'Tarih yok'
  return `Arama · ${movie.title} · ${year}`
}
