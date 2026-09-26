import { z } from 'zod'

/** "/works/OL893414W" → "OL893414W" */
export function idFromKey(key: string): string {
  return key.split('/').filter(Boolean).at(-1) ?? key
}

const searchDocSchema = z
  .object({
    key: z.string(),
    title: z.string(),
    author_name: z.array(z.string()).optional(),
    first_publish_year: z.number().optional(),
    cover_i: z.number().optional(),
  })
  .transform((doc) => ({
    id: idFromKey(doc.key),
    title: doc.title,
    authors: doc.author_name ?? [],
    firstPublishYear: doc.first_publish_year ?? null,
    coverId: doc.cover_i ?? null,
  }))

export const searchResponseSchema = z
  .object({
    numFound: z.number(),
    docs: z.array(searchDocSchema),
  })
  .transform((response) => ({ total: response.numFound, books: response.docs }))

export type BookSummary = z.output<typeof searchDocSchema>
export type SearchResult = z.output<typeof searchResponseSchema>

/** Open Library metin alanları bazen düz string, bazen `{ type, value }` nesnesidir. */
const textSchema = z
  .union([z.string(), z.object({ value: z.string() })])
  .transform((text) => (typeof text === 'string' ? text : text.value))

export const workSchema = z
  .object({
    key: z.string(),
    title: z.string(),
    description: textSchema.optional(),
    covers: z.array(z.number()).optional(),
    subjects: z.array(z.string()).optional(),
    authors: z.array(z.object({ author: z.object({ key: z.string() }) })).optional(),
  })
  .transform((work) => ({
    id: idFromKey(work.key),
    title: work.title,
    description: work.description?.trim() || null,
    coverId: work.covers?.find((id) => id > 0) ?? null,
    subjects: (work.subjects ?? []).slice(0, 8),
    authorIds: (work.authors ?? []).map((a) => idFromKey(a.author.key)),
  }))

export type Work = z.output<typeof workSchema>

export const authorSchema = z
  .object({ key: z.string(), name: z.string() })
  .transform((author) => ({ id: idFromKey(author.key), name: author.name }))

export type Author = z.output<typeof authorSchema>
