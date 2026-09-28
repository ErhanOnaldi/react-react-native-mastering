export type LocalizedMovie = { id: number; title: string }

export function sortAndFilterMovies(movies: LocalizedMovie[], query: string): LocalizedMovie[] {
  return movies.filter((movie) => movie.title.includes(query))
}
