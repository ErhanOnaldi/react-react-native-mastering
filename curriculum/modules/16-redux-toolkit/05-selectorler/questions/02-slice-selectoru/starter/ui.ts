import { createSlice } from '@reduxjs/toolkit'
export const uiSlice = createSlice({
  name: 'ui',
  initialState: { theme: 'light' as 'light' | 'dark', dialogOpen: false },
  reducers: {
    setTheme(state, action: { payload: 'light' | 'dark' }) {
      state.theme = action.payload
    },
  },
  selectors: { selectIsDark: (_state) => false },
})
export const { setTheme } = uiSlice.actions
export const { selectIsDark } = uiSlice.selectors
