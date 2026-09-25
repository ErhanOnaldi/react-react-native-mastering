export type Paginated<T> = {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
export function findOnPage<T extends { id: number }>(
  page: Paginated<T>,
  id: number,
): T | undefined {
  return page.results.find((item) => item.id === id)
}
