export type PageRange = [first: number, last: number]

export function pageRange(page: number, totalPages: number): PageRange {
  return [1, 1]
}
