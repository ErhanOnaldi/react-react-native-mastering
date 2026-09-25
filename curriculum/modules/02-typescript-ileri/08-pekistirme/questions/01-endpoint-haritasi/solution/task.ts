export type Movie = { id: number; title: string }
export type MovieDetails = Movie & { runtime: number | null }
export type Paginated<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
export type EndpointMap = {
  '/trending/movie/week': Paginated<Movie>
  '/movie/popular': Paginated<Movie>
  '/movie/550': MovieDetails
}
export function readEndpoint<K extends keyof EndpointMap>(
  path: K,
  responses: EndpointMap,
): EndpointMap[K] {
  return responses[path]
}
