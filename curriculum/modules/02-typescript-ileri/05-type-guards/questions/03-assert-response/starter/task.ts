export type MoviePage = { page: number; results: { id: number; title: string }[] }
export function assertMoviePage(value: unknown): asserts value is MoviePage {
  throw new Error('Geçersiz film sayfası')
}
