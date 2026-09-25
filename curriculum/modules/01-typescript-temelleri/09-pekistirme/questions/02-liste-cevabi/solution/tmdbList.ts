export interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
}
export interface MovieListResponse {
  page: number
  results: Movie[]
  total_pages: number
  total_results: number
}

export function pageTitles(response: MovieListResponse): string[] {
  return response.results.map((movie) => movie.title)
}
