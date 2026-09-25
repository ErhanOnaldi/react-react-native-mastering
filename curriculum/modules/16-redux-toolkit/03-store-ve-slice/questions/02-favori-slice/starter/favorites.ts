import { createSlice } from '@reduxjs/toolkit'
const slice = createSlice({
  name: 'favorites',
  initialState: { ids: [] as number[] },
  reducers: {
    toggleFavorite() {
      return { ids: [] as number[] }
    },
  },
  selectors: { selectFavoriteIds: (state) => state.ids },
})
export const favoritesSlice = slice
export const { toggleFavorite } = slice.actions
export const { selectFavoriteIds } = slice.selectors
