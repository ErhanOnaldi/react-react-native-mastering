import { z } from 'zod'
const listSchema = z.object({ results: z.array(z.object({ title: z.string().min(1) })) })
export function describeListError(raw: unknown): string | null {
  const result = listSchema.safeParse(raw)
  return result.success ? null : z.prettifyError(result.error)
}
