export type MoviePage = { page: number; results: { id: number; title: string }[] }
export function assertMoviePage(value: unknown): asserts value is MoviePage {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('page' in value) ||
    typeof value.page !== 'number' ||
    !('results' in value) ||
    !Array.isArray(value.results) ||
    !value.results.every(
      (item: unknown) =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        typeof item.id === 'number' &&
        'title' in item &&
        typeof item.title === 'string',
    )
  ) {
    throw new Error('Geçersiz film sayfası')
  }
}
