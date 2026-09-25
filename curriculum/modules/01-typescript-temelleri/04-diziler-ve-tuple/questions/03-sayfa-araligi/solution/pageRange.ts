export type PageRange = [first: number, last: number]

export function pageRange(page: number, totalPages: number): PageRange {
  return [Math.max(1, page - 1), Math.min(totalPages, page + 1)]
}
