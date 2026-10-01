export type SortBy = 'popularity.desc' | 'vote_average.desc'

export type DiscoverFilters = {
  genreId: number | null // null: tüm türler
  year: number | null // null: tüm yıllar
  sortBy: SortBy
  page: number
}

// Kullanıcının filtre panelinde yaptığı değişiklik
export type FilterChange = DiscoverFilters

export function applyFilterChange(current: DiscoverFilters, change: FilterChange): DiscoverFilters {
  return current
}
