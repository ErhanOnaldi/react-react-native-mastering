import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import {
  discoverMovies,
  getGenres,
  getMovieDetails,
  getTrendingMovies,
  searchMovies,
} from '@/features/movies/api/movies-api'

export const movieQueries = {
  all: ['movies'] as const,
  trending: (page: number) =>
    queryOptions({
      queryKey: ['movies', 'trending', page] as const,
      queryFn: () => getTrendingMovies(page),
    }),
  trendingInfinite: () =>
    infiniteQueryOptions({
      queryKey: ['movies', 'trending', 'infinite'] as const,
      queryFn: ({ pageParam }) => getTrendingMovies(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
      maxPages: 5,
    }),
  discover: ({ genreId, page }: { genreId: number; page: number }) =>
    queryOptions({
      queryKey: ['movies', 'discover', { genreId, page }] as const,
      queryFn: () => discoverMovies({ genreId, page }),
    }),
  search: ({ query, page }: { query: string; page: number }) =>
    queryOptions({
      queryKey: ['movies', 'search', { query, page }] as const,
      queryFn: () => searchMovies({ query, page }),
      staleTime: 60_000,
    }),
  detail: (id: number) =>
    queryOptions({
      queryKey: ['movies', 'detail', id] as const,
      queryFn: () => getMovieDetails(id),
      staleTime: 60_000,
    }),
  genres: () =>
    queryOptions({
      queryKey: ['movies', 'genres'] as const,
      queryFn: getGenres,
    }),
}
