import { createSlice } from '@reduxjs/toolkit'
export const listSlice = createSlice({
  name: 'watchlists',
  initialState: { ids: [] as number[] },
  reducers: {
    addMany(state, action: { payload: number[] }) {
      for (const id of action.payload) if (!state.ids.includes(id)) state.ids.push(id)
    },
  },
})
export const { addMany } = listSlice.actions
