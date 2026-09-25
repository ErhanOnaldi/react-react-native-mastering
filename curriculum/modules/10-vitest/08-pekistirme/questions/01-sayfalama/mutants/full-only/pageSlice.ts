export function pageSlice<T>(items: T[], page: number, pageSize = 20): T[] {
  const part = items.slice((page - 1) * pageSize, page * pageSize)
  return part.length === pageSize ? part : []
}
