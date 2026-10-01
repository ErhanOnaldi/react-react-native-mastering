import { createSlice } from '@reduxjs/toolkit'
export const recentSlice = createSlice({
  name: 'recentlyViewed',
  initialState: { ids: [] as number[] },
  reducers: {
    viewed(state, action: { payload: number }) {
      state.ids = state.ids.filter((id) => id !== action.payload)
      state.ids.unshift(action.payload)
      state.ids = state.ids.slice(0, 5)
    },
  },
})
export const { viewed } = recentSlice.actions
