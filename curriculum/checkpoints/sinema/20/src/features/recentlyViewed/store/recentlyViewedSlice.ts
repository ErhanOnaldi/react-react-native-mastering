import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: { ids: [] as number[] },
  reducers: {
    clearRecentlyViewed() {
      return { ids: [] as number[] }
    },
    viewMovie(state, action: PayloadAction<number>) {
      state.ids = [
        action.payload,
        ...state.ids.filter((id) => id !== action.payload),
      ].slice(0, 5)
    },
  },
})
export const { viewMovie, clearRecentlyViewed } = recentlyViewedSlice.actions
