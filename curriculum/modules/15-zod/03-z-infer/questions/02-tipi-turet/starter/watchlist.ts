import { z } from 'zod'
export const watchlistSchema = z.object({ name: z.string(), isPublic: z.boolean() })
export type WatchlistValues = unknown
export function createWatchlist(raw: unknown): WatchlistValues {
  return watchlistSchema.parse(raw)
}
export function formatWatchlist(_values: WatchlistValues): string {
  return ''
}
