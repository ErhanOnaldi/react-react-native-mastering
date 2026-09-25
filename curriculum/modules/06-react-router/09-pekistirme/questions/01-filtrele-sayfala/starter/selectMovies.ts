export interface Movie {
  id: number
  title: string
  genre_ids: number[]
}
export function selectMovies(movies: Movie[], params: URLSearchParams, pageSize: number): Movie[] {
  return movies
}
