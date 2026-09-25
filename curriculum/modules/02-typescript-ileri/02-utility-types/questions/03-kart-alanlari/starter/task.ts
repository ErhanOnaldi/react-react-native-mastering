export type Movie = {
  id: number
  title: string
  poster_path: string | null
  vote_average: number
  genre_ids: number[]
}
export type MovieCardData = Pick<Movie, 'id' | 'title' | 'poster_path'>
export function cardLabel(movie: MovieCardData): string {
  return movie.title
}
