import { z } from 'zod'
const titleSchema = z.object({ title: z.string().min(1) })
export function movieLabel(raw: unknown): string {
  const result = titleSchema.safeParse(raw)
  return result.success ? result.data.title : 'Film verisi geçersiz'
}
