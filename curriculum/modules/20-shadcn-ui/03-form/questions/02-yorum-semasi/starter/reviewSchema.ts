import { z } from 'zod'

export const reviewSchema = z.object({
  body: z.string().trim().min(1).max(500),
  rating: z.number().int().min(1).max(5),
})

export type ReviewValues = z.infer<typeof reviewSchema>
