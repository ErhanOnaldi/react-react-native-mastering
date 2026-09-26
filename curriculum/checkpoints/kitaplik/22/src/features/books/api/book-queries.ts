import { queryOptions } from '@tanstack/react-query'
import { getAuthor, getWork, searchBooks, type SearchParams } from './books-api'

export const bookQueries = {
  all: () => ['books'] as const,
  search: (params: SearchParams) =>
    queryOptions({
      queryKey: [...bookQueries.all(), 'search', params] as const,
      queryFn: ({ signal }) => searchBooks(params, signal),
      staleTime: 5 * 60_000,
    }),
  work: (workId: string) =>
    queryOptions({
      queryKey: [...bookQueries.all(), 'work', workId] as const,
      queryFn: ({ signal }) => getWork(workId, signal),
      staleTime: 30 * 60_000,
    }),
  author: (authorId: string) =>
    queryOptions({
      queryKey: ['authors', authorId] as const,
      queryFn: ({ signal }) => getAuthor(authorId, signal),
      // Yazar bilgisi neredeyse hiç değişmez
      staleTime: Infinity,
    }),
}
