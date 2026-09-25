import { useSuspenseQuery } from '@tanstack/react-query'
export function MovieDetail({
  id,
  load,
}: {
  id: number
  load: (id: number) => Promise<{ id: number; title: string }>
}) {
  void useSuspenseQuery
  void load
  return <h1>Film</h1>
}
