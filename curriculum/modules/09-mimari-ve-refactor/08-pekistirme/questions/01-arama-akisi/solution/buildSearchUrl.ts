export function buildSearchUrl(query: string, page: number): string {
  const url = new URL('https://api.themoviedb.org/3/search/movie')
  url.searchParams.set('language', 'tr-TR')
  url.searchParams.set('query', query)
  url.searchParams.set('page', String(page))
  return url.toString()
}
