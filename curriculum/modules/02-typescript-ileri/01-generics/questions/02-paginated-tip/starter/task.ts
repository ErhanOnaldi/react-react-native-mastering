export type Movie = { id: number; title: string }
export type Genre = { id: number; name: string }
export type Paginated<T> = { page: number; results: T[]; total_pages: number; total_results: number }
export type MovieListResponse = Paginated<Movie>
export type GenreListResponse = Paginated<Genre>
export function firstResult<T>(response: Paginated<T>): T | undefined {
  return undefined
}
