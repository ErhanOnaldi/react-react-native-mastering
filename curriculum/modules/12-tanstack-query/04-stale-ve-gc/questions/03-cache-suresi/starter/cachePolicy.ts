export function detailOptions(id: number) {
  return {
    queryKey: ['movies', 'detail', id],
    queryFn: async () => ({ id, title: '' }),
    staleTime: 0,
    gcTime: 0,
  }
}
