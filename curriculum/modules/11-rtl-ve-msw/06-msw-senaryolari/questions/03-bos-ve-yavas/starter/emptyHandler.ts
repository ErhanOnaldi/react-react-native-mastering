import { delay, http, HttpResponse } from 'msw'
export function makeEmptySearchHandler(waitMs: number) {
  return http.get('https://api.themoviedb.org/3/search/movie', () =>
    HttpResponse.json({ page: 1, results: [], total_pages: 1, total_results: 0 }),
  )
}
