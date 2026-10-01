import type { QueryClient } from '@tanstack/react-query'
import { movieQueries } from './movieQueries'
export async function loadMovieTitle(client: QueryClient, id: number): Promise<string> {
  const movie = await client.fetchQuery(movieQueries.detail(id))
  return movie.title
}
