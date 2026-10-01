import { z } from 'zod'
const pageSchema = z.coerce.number().int().min(1)
const flagSchema = z.stringbool()
export function readFilters(search: string): { page: number; archived: boolean } {
  const params = new URLSearchParams(search)
  const page = pageSchema.safeParse(params.get('page') ?? '1')
  const archived = flagSchema.safeParse(params.get('archived') ?? 'false')
  return { page: page.success ? page.data : 1, archived: archived.success ? archived.data : false }
}
