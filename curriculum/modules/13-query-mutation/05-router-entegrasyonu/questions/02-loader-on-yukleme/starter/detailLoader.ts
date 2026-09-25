import type { QueryClient } from '@tanstack/react-query'
export function makeDetailLoader(
  client: QueryClient,
  load: (id: number) => Promise<{ id: number; title: string }>,
) {
  void client
  void load
  return async (_args: { params: { id?: string } }): Promise<{ id: number; title: string }> => ({
    id: 0,
    title: '',
  })
}
