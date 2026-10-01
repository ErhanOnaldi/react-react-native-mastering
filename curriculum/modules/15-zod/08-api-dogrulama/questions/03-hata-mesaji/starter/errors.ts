import { z } from 'zod'
const listSchema = z.object({ results: z.array(z.object({ title: z.string() })) })
export function describeListError(raw: unknown): string | null {
  return null
}
