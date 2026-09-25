export const SORT_FIELDS = ['popularity', 'vote_average', 'release_date'] as const
export type SortField = (typeof SORT_FIELDS)[number]
export function isSortField(value: string): value is SortField {
  return SORT_FIELDS.some((field) => field === value)
}
export function sortLabel(field: SortField): string {
  switch (field) {
    case 'popularity': return 'Popülerlik'
    case 'vote_average': return 'Puan'
    case 'release_date': return 'Vizyon tarihi'
  }
}
