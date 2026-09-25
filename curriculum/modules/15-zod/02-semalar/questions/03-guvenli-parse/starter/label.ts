import { z } from 'zod'
const titleSchema = z.object({ title: z.string() })
export function movieLabel(raw: unknown): string {
  return 'Film verisi geçersiz'
}
