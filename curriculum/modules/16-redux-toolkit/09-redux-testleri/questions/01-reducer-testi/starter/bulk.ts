import { createSlice } from '@reduxjs/toolkit'
export const listSlice = createSlice({
  name: 'watchlists',
  initialState: { ids: [] as number[] },
  reducers: {
    addMany(_state, _action: { payload: number[] }) {
      return { ids: [] as number[] }
    },
  },
})
export const { addMany } = listSlice.actions
