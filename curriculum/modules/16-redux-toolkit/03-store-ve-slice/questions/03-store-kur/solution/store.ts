import { configureStore, createSlice } from '@reduxjs/toolkit'
const favorites = createSlice({
  name: 'favorites',
  initialState: { ids: [] as number[] },
  reducers: {
    add(state, action: { payload: number }) {
      state.ids.push(action.payload)
    },
  },
})
const ui = createSlice({
  name: 'ui',
  initialState: { theme: 'light' as 'light' | 'dark' },
  reducers: {
    toggle(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    },
  },
})
export const { add } = favorites.actions
export const { toggle } = ui.actions
export const setupStore = () =>
  configureStore({ reducer: { favorites: favorites.reducer, ui: ui.reducer } })
