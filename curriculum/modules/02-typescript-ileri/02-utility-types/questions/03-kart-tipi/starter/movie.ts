/** Sinema'daki film tipi: TMDB liste cevabındaki tek film. */
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
