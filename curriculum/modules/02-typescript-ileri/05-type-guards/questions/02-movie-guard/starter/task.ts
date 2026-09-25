export type MovieBrief = { id: number; title: string; poster_path: string | null }
export function isMovieBrief(value: unknown): value is MovieBrief {
  return false
}
