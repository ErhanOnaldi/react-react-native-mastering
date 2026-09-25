import { z } from 'zod'
export const watchlistSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  name: z.string(),
  isPublic: z.boolean(),
})
export const newWatchlistSchema = watchlistSchema
export const publicWatchlistSchema = watchlistSchema
export const watchlistTitleSchema = watchlistSchema
