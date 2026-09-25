import { http, HttpResponse } from 'msw'
import type { TmdbListMovie } from '@test-utils'
export function makeSearchHandler(movies: TmdbListMovie[]) {
  return http.get('https://api.themoviedb.org/3/search/movie', () =>
    HttpResponse.json({ page: 1, results: movies, total_pages: 1, total_results: movies.length }),
  )
}
