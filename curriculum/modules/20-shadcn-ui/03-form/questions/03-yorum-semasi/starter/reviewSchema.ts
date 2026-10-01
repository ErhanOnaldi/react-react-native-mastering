import { z } from 'zod'

export const reviewSchema = z.object({})

export type ReviewValues = z.infer<typeof reviewSchema>
