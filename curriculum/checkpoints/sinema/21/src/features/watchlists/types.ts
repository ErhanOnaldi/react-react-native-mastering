import type { z } from 'zod'
import type { watchlistSchema } from './schemas'

export type WatchlistValues = z.output<typeof watchlistSchema>
export interface Watchlist extends WatchlistValues {
  id: string
  createdAt: string
  movieIds: number[]
}
export type WatchlistPatch = Partial<WatchlistValues>
