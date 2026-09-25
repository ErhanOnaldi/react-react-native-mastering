export const SORT_FIELDS = ['popularity', 'vote_average', 'release_date'] as const
export type SortField = (typeof SORT_FIELDS)[number]
export function isSortField(value: string): value is SortField {
  return false
}
export function sortLabel(field: SortField): string {
  return ''
}
