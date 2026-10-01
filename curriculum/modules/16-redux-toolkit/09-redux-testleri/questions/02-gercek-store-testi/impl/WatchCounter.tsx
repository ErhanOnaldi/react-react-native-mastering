import { configureStore, createSlice } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'

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

export type RootState = ReturnType<ReturnType<typeof setupStore>['getState']>
export type AppDispatch = ReturnType<typeof setupStore>['dispatch']
const useAppSelector = useSelector.withTypes<RootState>()
const useAppDispatch = useDispatch.withTypes<AppDispatch>()

export function WatchCounter() {
  const count = useAppSelector((state) => state.watchlists.ids.length)
  const dispatch = useAppDispatch()
  return (
    <section>
      <output>{count} film</output>
      <button onClick={() => dispatch(watchlistSlice.actions.add(550))}>550 ekle</button>
    </section>
  )
}
