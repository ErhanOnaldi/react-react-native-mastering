import { createSelector } from '@reduxjs/toolkit'
export type State = { favorites: { ids: number[] }; watchlists: { selectedIds: number[] } }
export const selectOverlap = createSelector(
  [(s: State) => s.favorites.ids, (s: State) => s.watchlists.selectedIds],
  (favorites, selected) => selected.filter((id) => favorites.includes(id)),
)
