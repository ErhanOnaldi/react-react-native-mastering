import { z } from 'zod'
export const reviewSchema = z
  .object({
    body: z.string(),
    hasSpoiler: z.boolean(),
  })
  .refine((value) => !value.hasSpoiler || value.body.trim().length >= 10, {
    path: ['body'],
    error: 'Spoiler açıklaması çok kısa',
  })
