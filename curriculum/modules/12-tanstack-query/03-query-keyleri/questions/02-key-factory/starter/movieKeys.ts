export const movieKeys = {
  all: ['movies'] as const,
  search: (query: string, page: number) => ['movies', 'search'] as const,
  detail: (id: number) => ['movies', 'detail'] as const,
}
