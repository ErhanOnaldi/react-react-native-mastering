export type MoviePage = { page: number; results: { id: number; title: string }[] }
export function isMoviePage(value: unknown): value is MoviePage {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  if (!('page' in value) || typeof value.page !== 'number') return false
  if (!('results' in value) || !Array.isArray(value.results)) return false
  return value.results.every(
    (item: unknown) =>
      typeof item === 'object' &&
      item !== null &&
      'id' in item &&
      typeof item.id === 'number' &&
      'title' in item &&
      typeof item.title === 'string',
  )
}
