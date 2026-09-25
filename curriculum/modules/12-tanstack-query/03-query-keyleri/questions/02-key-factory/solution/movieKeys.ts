export const movieKeys = {
  all: ['movies'] as const,
  search: (query: string, page: number) => ['movies', 'search', query.trim(), page] as const,
  detail: (id: number) => ['movies', 'detail', id] as const,
}
