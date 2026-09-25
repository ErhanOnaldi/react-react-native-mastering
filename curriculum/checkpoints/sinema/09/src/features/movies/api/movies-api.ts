import { tmdbClient } from '@/shared/api/tmdb-client'
import type {
  Genre,
  MovieDetails,
  MovieListResponse,
} from '@/features/movies/types'

export function getTrendingMovies(page: number): Promise<MovieListResponse> {
  return tmdbClient.get('/trending/movie/week', { page })
}

export function discoverMovies({
  genreId,
  page,
}: {
  genreId: number
  page: number
}): Promise<MovieListResponse> {
  return tmdbClient.get('/discover/movie', { with_genres: genreId, page })
}

export function searchMovies({
  query,
  page,
}: {
  query: string
  page: number
}): Promise<MovieListResponse> {
  return tmdbClient.get('/search/movie', { query, page })
}

export function getMovieDetails(id: number): Promise<MovieDetails> {
  return tmdbClient.get(`/movie/${id}`, {
    append_to_response: 'credits,videos',
  })
}

export function getGenres(): Promise<{ genres: Genre[] }> {
  return tmdbClient.get('/genre/movie/list')
}
