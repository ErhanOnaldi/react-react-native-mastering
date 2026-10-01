import { configureStore, createSlice } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'

const watchlistSlice = createSlice({
  name: 'watchlists',
  initialState: { ids: [] as number[] },
  reducers: {
    add(state, action: { payload: number }) {
      if (!state.ids.includes(action.payload)) state.ids.push(action.payload)
    },
  },
})
export const setupStore = (ids: number[] = []) =>
  configureStore({
    reducer: { watchlists: watchlistSlice.reducer },
    preloadedState: { watchlists: { ids } },
  })
type RootState = ReturnType<ReturnType<typeof setupStore>['getState']>
const useAppSelector = useSelector.withTypes<RootState>()
export function WatchCounter() {
  const count = useAppSelector((state) => state.watchlists.ids.length)
  return (
    <section>
      <output>{count} film</output>
      <button>550 ekle</button>
    </section>
  )
}
