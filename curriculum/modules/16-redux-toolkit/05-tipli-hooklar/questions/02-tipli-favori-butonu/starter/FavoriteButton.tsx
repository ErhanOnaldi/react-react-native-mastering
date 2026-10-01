import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { useRef } from 'react'
const slice = createSlice({
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
const ui = createSlice({
  name: 'ui',
  initialState: { theme: 'light' as 'light' | 'dark' },
  reducers: {
    setTheme(state, action: { payload: 'light' | 'dark' }) {
      state.theme = action.payload
    },
  },
})
export const { setTheme } = ui.actions
export const setupStore = (ids: number[] = []) =>
  configureStore({
    reducer: { favorites: slice.reducer, ui: ui.reducer },
    preloadedState: { favorites: { ids }, ui: { theme: 'light' as const } },
  })
// Store'dan RootState ve AppDispatch tiplerini türet; .withTypes hook'larını oluştur.
export function FavoriteButton({ id }: { id: number }) {
  // Store'dan yalnızca bu ID'nin favori olup olmadığını oku ve toggle action'ını gönder.
  return <button>Favorilere ekle</button>
}
export function ThemeProbe() {
  const theme = useAppSelector((state) => state.ui.theme)
  const renders = useRef(0)
  renders.current += 1
  return (
    <output aria-label="Tema render sayacı">
      Tema: {theme}; render: {renders.current}
    </output>
  )
}
export function Demo({ id }: { id: number }) {
  return (
    <Provider store={setupStore()}>
      <FavoriteButton id={id} />
      <ThemeProbe />
    </Provider>
  )
}
