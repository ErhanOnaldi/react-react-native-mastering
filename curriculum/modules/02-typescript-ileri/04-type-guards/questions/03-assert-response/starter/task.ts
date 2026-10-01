export type MoviePage = { page: number; results: { id: number; title: string }[] }
export function isMoviePage(value: unknown): value is MoviePage {
  return false
}
