import { useAppDispatch, useAppSelector } from '@/app/store'
import { createWatchlist } from './store/watchlistsSlice'
import type { Watchlist, WatchlistValues } from './types'

export function useWatchlists() {
  const lists = useAppSelector((state) => state.watchlists.lists)
  const dispatch = useAppDispatch()
  const watchlists: Watchlist[] = lists.map((list) => ({
    id: list.id,
    name: list.name,
    description: list.description ?? '',
    isPublic: list.isPublic ?? false,
    tags: list.tags ?? [],
    createdAt: list.createdAt ?? '',
    movieIds: list.movieIds,
  }))
  function addWatchlist(values: WatchlistValues) {
    dispatch(
      createWatchlist({
        ...values,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      }),
    )
  }
  return { watchlists, addWatchlist }
}
