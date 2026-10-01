import { z } from 'zod'
export const reviewSchema = z.object({ body: z.string(), hasSpoiler: z.boolean() })
