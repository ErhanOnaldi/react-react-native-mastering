export type ListMovie = { title: string; poster_path: string | null }

export function movieTitles(movies: ListMovie[]): string[] {
  return movies.filter((movie) => movie.poster_path !== null).map((movie) => movie.title)
}
