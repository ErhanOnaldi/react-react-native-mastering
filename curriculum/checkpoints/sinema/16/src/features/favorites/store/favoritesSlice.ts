import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { ids: [] as number[] },
  reducers: {
    toggleFavorite(state, action: PayloadAction<number>) {
      const index = state.ids.indexOf(action.payload)
      if (index === -1) state.ids.push(action.payload)
      else state.ids.splice(index, 1)
    },
  },
})
export const { toggleFavorite } = favoritesSlice.actions
