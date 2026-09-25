import { tmdbClient } from '@/shared/api/tmdb-client'
import type { MovieDetails, MovieListResponse } from '@/features/movies/types'
import {
  movieListSchema,
  movieDetailsSchema,
  genreResponseSchema,
} from './schemas'

export function getTrendingMovies(page: number): Promise<MovieListResponse> {
  return tmdbClient.get('/trending/movie/week', movieListSchema, { page })
}

export function discoverMovies({
  genreId,
  page,
}: {
  genreId: number
  page: number
}): Promise<MovieListResponse> {
  return tmdbClient.get('/discover/movie', movieListSchema, {
    with_genres: genreId,
    page,
  })
}

export function searchMovies({
  query,
  page,
}: {
  query: string
  page: number
}): Promise<MovieListResponse> {
  return tmdbClient.get('/search/movie', movieListSchema, { query, page })
}

export function getMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbClient.get(`/movie/${id}`, movieDetailsSchema, {
    append_to_response: 'credits,videos',
  })
}

export function getGenres(): Promise<
  ReturnType<typeof genreResponseSchema.parse>
> {
  return tmdbClient.get('/genre/movie/list', genreResponseSchema)
}
