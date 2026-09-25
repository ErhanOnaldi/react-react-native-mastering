import { z } from 'zod'

export const movieSchema = z.object({
  id: z.number(),
  title: z.string().min(1),
  original_title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string(),
  genre_ids: z.array(z.number()),
  vote_average: z.number(),
  vote_count: z.number(),
  popularity: z.number(),
  adult: z.boolean(),
  original_language: z.string(),
  video: z.boolean(),
})

export const genreSchema = z.object({ id: z.number(), name: z.string() })
export const movieListSchema = z.object({
  page: z.number(),
  results: z.array(movieSchema),
  total_pages: z.number(),
  total_results: z.number(),
})

const castSchema = z.object({
  id: z.number(),
  name: z.string(),
  character: z.string(),
  profile_path: z.string().nullable(),
  order: z.number(),
})
const crewSchema = z.object({
  id: z.number(),
  name: z.string(),
  job: z.string(),
  department: z.string(),
  profile_path: z.string().nullable(),
})
const videoSchema = z.object({
  id: z.string(),
  key: z.string(),
  name: z.string(),
  site: z.string(),
  type: z.string(),
  official: z.boolean(),
  size: z.number(),
  published_at: z.string(),
})

export const movieDetailsSchema = movieSchema.omit({ genre_ids: true }).extend({
  runtime: z.number().nullable(),
  genres: z.array(genreSchema),
  tagline: z.string(),
  status: z.string(),
  budget: z.number(),
  revenue: z.number(),
  credits: z
    .object({ cast: z.array(castSchema), crew: z.array(crewSchema) })
    .optional(),
  videos: z.object({ results: z.array(videoSchema) }).optional(),
})
export const genreResponseSchema = z.object({ genres: z.array(genreSchema) })
