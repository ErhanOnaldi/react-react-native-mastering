import { createSlice } from '@reduxjs/toolkit'
const slice = createSlice({
  name: 'favorites',
  initialState: { ids: [] as number[] },
  reducers: {
    toggleFavorite(state, action: { payload: number }) {
      const index = state.ids.indexOf(action.payload)
      if (index === -1) state.ids.push(action.payload)
      else state.ids.splice(index, 1)
    },
  },
  selectors: { selectFavoriteIds: (state) => state.ids },
})
export const favoritesSlice = slice
export const { toggleFavorite } = slice.actions
export const { selectFavoriteIds } = slice.selectors
