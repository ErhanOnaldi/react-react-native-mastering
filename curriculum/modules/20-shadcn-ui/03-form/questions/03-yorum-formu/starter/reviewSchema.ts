import { z } from 'zod'

export const reviewSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, { error: 'Yorum gerekli' })
    .max(500, { error: 'Yorum en fazla 500 karakter olabilir' }),
  // Şema düzeyindeki mesaj: değer hiç yoksa ya da sayı değilse (NaN) görünür.
  rating: z
    .number({ error: 'Puan seç' })
    .int({ error: 'Puan tam sayı olmalı' })
    .min(1, { error: 'Puan 1 ile 5 arasında olmalı' })
    .max(5, { error: 'Puan 1 ile 5 arasında olmalı' }),
})

export type ReviewValues = z.infer<typeof reviewSchema>
