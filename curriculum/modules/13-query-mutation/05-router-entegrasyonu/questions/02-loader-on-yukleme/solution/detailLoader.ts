import type { QueryClient } from '@tanstack/react-query'
export function makeDetailLoader(
  client: QueryClient,
  load: (id: number) => Promise<{ id: number; title: string }>,
) {
  return async ({ params }: { params: { id?: string } }) => {
    const id = Number(params.id)
    if (!Number.isInteger(id) || id <= 0) throw new Error('Geçersiz film id')
    return client.ensureQueryData({ queryKey: ['movie', id], queryFn: () => load(id) })
  }
}
