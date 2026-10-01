export type Movie = { id: number; title: string }
export type MovieDetails = Movie & { runtime: number | null }
export type Paginated<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
export type EndpointMap = any
export function readEndpoint(path: string, responses: any): any {
  return undefined
}
