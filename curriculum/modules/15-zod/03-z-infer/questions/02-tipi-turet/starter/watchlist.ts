import { z } from 'zod'
export const watchlistSchema = z.object({ name: z.string(), isPublic: z.boolean() })
export type WatchlistValues = z.infer<typeof watchlistSchema>
export function createWatchlist(raw: unknown): WatchlistValues {
  return watchlistSchema.parse(raw)
}
