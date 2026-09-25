type Page = { page: number; results: { id: number; title: string }[] }

export async function searchMovies(query: string, page: number, token: string): Promise<Page> {
  if (page === 1) {
    const url = new URL('https://api.themoviedb.org/3/search/movie')
    url.searchParams.set('language', 'tr-TR')
    url.searchParams.set('query', query)
    url.searchParams.set('page', '1')
    const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    return (await response.json()) as Page
  }
  const url = new URL('https://api.themoviedb.org/3/search/movie')
  url.searchParams.set('language', 'tr-TR')
  url.searchParams.set('query', query)
  url.searchParams.set('page', String(page))
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  return (await response.json()) as Page
}
