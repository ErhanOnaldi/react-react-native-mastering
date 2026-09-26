import { z } from 'zod'

export const readingStatuses = ['want', 'reading', 'read'] as const
export type ReadingStatus = (typeof readingStatuses)[number]

export const statusLabels: Record<ReadingStatus, string> = {
  want: 'Okumak istiyorum',
  reading: 'Okuyorum',
  read: 'Okudum',
}

export const NOTE_MAX_LENGTH = 280

/** localStorage'da saklanan tek kayıt. Tarayıcıdaki veri de dış veridir: okurken doğrulanır. */
export const readingEntrySchema = z
  .object({
    workId: z.string().regex(/^OL\d+W$/),
    title: z.string().min(1),
    authors: z.array(z.string()),
    coverId: z.number().nullable(),
    status: z.enum(readingStatuses),
    rating: z.number().int().min(1).max(5).nullable(),
    note: z.string().max(NOTE_MAX_LENGTH),
    updatedAt: z.string(),
  })
  .refine((entry) => entry.status !== 'read' || entry.rating !== null, {
    path: ['rating'],
    error: 'Okunmuş kitap için puan gerekir.',
  })
export type ReadingEntry = z.infer<typeof readingEntrySchema>

export const readingListSchema = z.array(readingEntrySchema)

/** Formun alanları: kullanıcıdan gelen ham değerler (select'ler string döner). */
const readingFormFields = z.object({
  status: z.enum(readingStatuses),
  rating: z.enum(['', '1', '2', '3', '4', '5']),
  note: z
    .string()
    .trim()
    .max(NOTE_MAX_LENGTH, { error: `Not en fazla ${NOTE_MAX_LENGTH} karakter olabilir.` }),
})

/** Form şeması: alanlar + alanlar arası kural + kayda uygun çıktı. */
export const readingFormSchema = readingFormFields
  .refine((values) => values.status !== 'read' || values.rating !== '', {
    error: 'Okuduğun kitaba 1–5 arası puan ver.',
    path: ['rating'],
    // Not alanı hatalıyken de çalışsın: kullanıcı tüm hataları bir kerede görsün
    when: (payload) =>
      readingFormFields.pick({ status: true, rating: true }).safeParse(payload.value).success,
  })
  .transform((values) => ({
    status: values.status,
    rating: values.status === 'read' ? Number(values.rating) : null,
    note: values.note,
  }))

export type ReadingFormInput = z.input<typeof readingFormSchema>
export type ReadingFormOutput = z.output<typeof readingFormSchema>
