export function pageSlice<T>(items: T[], page: number, pageSize = 20): T[] {
  return items.slice(page * pageSize, (page + 1) * pageSize)
}
