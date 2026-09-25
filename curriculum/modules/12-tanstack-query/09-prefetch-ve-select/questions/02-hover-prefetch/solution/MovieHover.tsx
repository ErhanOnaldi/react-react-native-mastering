import { useQueryClient } from '@tanstack/react-query'
import { movieQueries } from './movieQueries'
export function MovieHover({ id, title }: { id: number; title: string }) {
  const client = useQueryClient()
  return (
    <button onMouseEnter={() => void client.prefetchQuery(movieQueries.detail(id))}>{title}</button>
  )
}
