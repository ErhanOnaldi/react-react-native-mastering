import { useQueryClient } from '@tanstack/react-query'
import { movieQueries } from './movieQueries'
export function MovieHover({ id, title }: { id: number; title: string }) {
  return <button>{title}</button>
}
