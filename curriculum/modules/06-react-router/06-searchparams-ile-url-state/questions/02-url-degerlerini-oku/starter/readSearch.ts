export interface SearchState {
  q: string
  page: number
  genre: number | null
}
export function readSearch(params: URLSearchParams): SearchState {
  return { q: '', page: 1, genre: null }
}
