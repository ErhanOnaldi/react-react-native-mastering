import type { z } from 'zod'
import type {
  movieSchema,
  movieDetailsSchema,
  genreSchema,
  movieListSchema,
} from './api/schemas'

export type Movie = z.infer<typeof movieSchema>
export type MovieDetails = z.infer<typeof movieDetailsSchema>
export type Genre = z.infer<typeof genreSchema>
export type CastMember = NonNullable<MovieDetails['credits']>['cast'][number]
export type CrewMember = NonNullable<MovieDetails['credits']>['crew'][number]
export type Video = NonNullable<MovieDetails['videos']>['results'][number]
export interface Paginated<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
export type MovieListResponse = z.infer<typeof movieListSchema>
