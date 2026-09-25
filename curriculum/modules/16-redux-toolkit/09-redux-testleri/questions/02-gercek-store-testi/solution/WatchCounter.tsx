import { configureStore, createSlice } from '@reduxjs/toolkit'
import { Provider, useDispatch, useSelector } from 'react-redux'
const slice = createSlice({
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
    reducer: { watchlists: slice.reducer },
    preloadedState: { watchlists: { ids } },
  })
type RootState = ReturnType<ReturnType<typeof setupStore>['getState']>
type AppDispatch = ReturnType<typeof setupStore>['dispatch']
const useAppSelector = useSelector.withTypes<RootState>()
const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export function WatchCounter() {
  const count = useAppSelector((s) => s.watchlists.ids.length)
  const dispatch = useAppDispatch()
  return (
    <div>
      <output>{count} film</output>
      <button onClick={() => dispatch(slice.actions.add(550))}>550 ekle</button>
    </div>
  )
}
export function Demo() {
  return (
    <Provider store={setupStore()}>
      <WatchCounter />
    </Provider>
  )
}
