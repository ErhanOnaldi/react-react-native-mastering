const BASE = 'https://api.themoviedb.org/3'
export interface SearchResult {
  page: number
  results: { id: number; title: string }[]
}
export async function searchMovies(query: string, page: number): Promise<SearchResult> {
  const trimmed = query.trim()
  if (!trimmed) return { page, results: [] }
  const url = new URL(BASE + '/search/movie')
  url.searchParams.set('query', trimmed)
  url.searchParams.set('page', String(page))
  url.searchParams.set('language', 'tr-TR')
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
  })
  return response.json() as Promise<SearchResult>
}
