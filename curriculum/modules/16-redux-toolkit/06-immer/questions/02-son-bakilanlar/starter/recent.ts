import { createSlice } from '@reduxjs/toolkit'
export const recentSlice = createSlice({
  name: 'recentlyViewed',
  initialState: { ids: [] as number[] },
  reducers: {
    viewed(_state, _action: { payload: number }) {
      return { ids: [] as number[] }
    },
  },
})
export const { viewed } = recentSlice.actions
