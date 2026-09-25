/** TMDB liste endpoint'lerindeki tek film. Detay cevabı daha sonra genişletilecek. */
export interface Movie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  genre_ids: number[]
  vote_average: number
  vote_count: number
  popularity: number
  adult: boolean
  original_language: string
  video: boolean
}

export interface Genre {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
  size: number
  published_at: string
}

export interface MovieDetails extends Omit<Movie, 'genre_ids'> {
  runtime: number | null
  genres: Genre[]
  tagline: string
  status: string
  budget: number
  revenue: number
  credits?: { cast: CastMember[]; crew: CrewMember[] }
  videos?: { results: Video[] }
}

export interface Paginated<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export type MovieListResponse = Paginated<Movie>
