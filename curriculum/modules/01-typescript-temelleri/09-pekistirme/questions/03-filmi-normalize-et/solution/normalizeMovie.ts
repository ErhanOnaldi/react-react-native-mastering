export type RawMovie = { id: number; title: string; release_date: string; poster_path: string | null }
export type DisplayMovie = { id: number; title: string; year: string; poster: string | null }

export function normalizeMovie(movie: RawMovie): DisplayMovie {
  return {
    id: movie.id,
    title: movie.title,
    year: movie.release_date === '' ? 'Tarih yok' : movie.release_date.slice(0, 4),
    poster: movie.poster_path === '' ? null : movie.poster_path,
  }
}
