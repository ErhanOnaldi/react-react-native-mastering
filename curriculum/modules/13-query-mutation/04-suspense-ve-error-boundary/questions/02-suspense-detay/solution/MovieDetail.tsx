import { useSuspenseQuery } from '@tanstack/react-query'
export function MovieDetail({
  id,
  load,
}: {
  id: number
  load: (id: number) => Promise<{ id: number; title: string }>
}) {
  const { data } = useSuspenseQuery({ queryKey: ['movie', id], queryFn: () => load(id) })
  return <h1>{data.title}</h1>
}
