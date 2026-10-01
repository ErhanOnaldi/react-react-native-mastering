import { z } from 'zod'
export const watchlistSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  name: z.string().min(1),
  isPublic: z.boolean(),
})
export const newWatchlistSchema = watchlistSchema.omit({ id: true, createdAt: true })
export const publicWatchlistSchema = watchlistSchema.extend({ shareUrl: z.url() })
export const watchlistTitleSchema = watchlistSchema.pick({ name: true })
