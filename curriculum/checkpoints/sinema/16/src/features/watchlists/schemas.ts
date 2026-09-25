import { z } from 'zod'

export const watchlistSchema = z.object({
  name: z.string().trim().min(1, 'Ad gerekli'),
  description: z.string(),
  isPublic: z.boolean(),
  tags: z.array(z.object({ value: z.string() })),
})
export const reviewSchema = z.object({
  body: z.string().trim().min(1, 'Yorum gerekli'),
  rating: z.number().min(1, 'Puan seç').max(5, 'Puan en fazla 5 olabilir'),
})
