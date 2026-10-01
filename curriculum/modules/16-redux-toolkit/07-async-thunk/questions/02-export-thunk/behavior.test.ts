import { configureStore } from '@reduxjs/toolkit'
import { describe, expect, it } from 'vitest'
import { exportList, exportSlice } from '@exercise/exportList'
describe('watchlist export thunk', () => {
  it('pending ve fulfilled yaşam döngüsünü store’da gösterir', async () => {
    const store = configureStore({ reducer: { export: exportSlice.reducer } })
    const promise = store.dispatch(exportList([550, 603]))
    expect(store.getState().export.status).toBe('pending')
    await promise
    expect(store.getState().export).toEqual({ status: 'fulfilled', ids: [550, 603] })
  })
  it('girdi dizisini değiştirmeden kopyalar', async () => {
    const ids = [155]
    const store = configureStore({ reducer: { export: exportSlice.reducer } })
    await store.dispatch(exportList(ids))
    expect(store.getState().export.ids).toEqual(ids)
    expect(store.getState().export.ids).not.toBe(ids)
  })
})
