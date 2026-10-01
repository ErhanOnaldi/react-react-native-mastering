import { createSlice } from '@reduxjs/toolkit'

export const listSlice = createSlice({
  name: 'watchlist',
  initialState: { ids: [] as number[] },
  reducers: {
    addMany(state, action: { payload: number[] }) {
      const existing = new Set(state.ids)
      for (const id of action.payload) {
        if (!existing.has(id)) state.ids.push(id)
      }
    },
  },
})

export const { addMany } = listSlice.actions
