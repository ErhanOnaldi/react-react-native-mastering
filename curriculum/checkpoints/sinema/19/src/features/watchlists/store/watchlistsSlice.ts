import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { WatchlistValues } from '../types'

export type List = { id: string; name: string; movieIds: number[] } & Partial<
  Omit<WatchlistValues, 'name'>
> & { createdAt?: string }

export const watchlistsSlice = createSlice({
  name: 'watchlists',
  initialState: { lists: [] as List[] },
  reducers: {
    clearWatchlists() {
      return { lists: [] as List[] }
    },
    createWatchlist(
      state,
      action: PayloadAction<
        { id: string; name: string } & Partial<
          Omit<WatchlistValues, 'name'>
        > & { createdAt?: string }
      >,
    ) {
      if (state.lists.some((list) => list.id === action.payload.id)) return
      state.lists.push({ ...action.payload, movieIds: [] })
    },
    addMovie(
      state,
      action: PayloadAction<{ listId: string; movieId: number }>,
    ) {
      const list = state.lists.find((item) => item.id === action.payload.listId)
      if (list && !list.movieIds.includes(action.payload.movieId))
        list.movieIds.push(action.payload.movieId)
    },
  },
})
export const { createWatchlist, addMovie, clearWatchlists } =
  watchlistsSlice.actions
