import { z } from 'zod'
const pageSchema = z.coerce.number()
const flagSchema = z.stringbool()
export function readFilters(search: string): { page: number; archived: boolean } {
  return { page: 1, archived: false }
}
