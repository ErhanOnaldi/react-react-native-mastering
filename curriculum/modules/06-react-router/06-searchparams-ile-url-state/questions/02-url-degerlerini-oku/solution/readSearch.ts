export interface SearchState {
  q: string
  page: number
  genre: number | null
}
export function readSearch(params: URLSearchParams): SearchState {
  const q = (params.get('q') ?? '').trim()
  const rawPage = Number(params.get('page') ?? '1')
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1
  const rawGenre = params.get('genre')
  const parsedGenre = rawGenre === null ? null : Number(rawGenre)
  const genre =
    parsedGenre !== null && Number.isSafeInteger(parsedGenre) && parsedGenre > 0
      ? parsedGenre
      : null
  return { q, page, genre }
}
