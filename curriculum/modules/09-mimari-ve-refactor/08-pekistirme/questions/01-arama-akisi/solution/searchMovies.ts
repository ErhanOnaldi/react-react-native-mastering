import { buildSearchUrl } from './buildSearchUrl'

type Page = { page: number; results: { id: number; title: string }[] }

export async function searchMovies(query: string, page: number, token: string): Promise<Page> {
  const response = await fetch(buildSearchUrl(query, page), {
    headers: { Authorization: `Bearer ${token}` },
  })
  return (await response.json()) as Page
}
