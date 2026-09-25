import { configureStore, createListenerMiddleware, createSlice } from '@reduxjs/toolkit'
const favorites = createSlice({
  name: 'favorites',
  initialState: { ids: [] as number[] },
  reducers: {
    toggle(state, action: { payload: number }) {
      const i = state.ids.indexOf(action.payload)
      if (i < 0) state.ids.push(action.payload)
      else state.ids.splice(i, 1)
    },
  },
})
export const { toggle } = favorites.actions
export function setupStore() {
  const listener = createListenerMiddleware()
  listener.startListening({
    actionCreator: toggle,
    effect: (_action, api) => {
      try {
        localStorage.setItem(
          'sinema:favorites',
          JSON.stringify((api.getState() as { favorites: { ids: number[] } }).favorites.ids),
        )
      } catch {
        /* storage kapalıysa UI çalışır */
      }
    },
  })
  return configureStore({
    reducer: { favorites: favorites.reducer },
    middleware: (gdm) => gdm().prepend(listener.middleware),
  })
}
