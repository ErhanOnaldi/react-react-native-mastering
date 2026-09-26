import { z } from 'zod'

export const watchlistSchema = z.object({
  name: z.string().trim().min(1, 'Ad gerekli'),
  description: z.string(),
  isPublic: z.boolean(),
  tags: z.array(z.object({ value: z.string() })),
})
export const reviewSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, { error: 'Yorum gerekli' })
    .max(500, { error: 'Yorum en fazla 500 karakter olabilir' }),
  // Şema düzeyi mesaj: hiç puan seçilmediğinde (undefined) görünür.
  rating: z
    .number({ error: 'Puan seç' })
    .int({ error: 'Puan tam sayı olmalı' })
    .min(1, { error: 'Puan seç' })
    .max(5, { error: 'Puan en fazla 5 olabilir' }),
})
