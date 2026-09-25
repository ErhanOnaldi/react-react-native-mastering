import { http, HttpResponse } from 'msw'
import type { TmdbListMovie } from '@test-utils'
export function makeSearchHandler(movies: TmdbListMovie[]) {
  return http.get('https://api.themoviedb.org/3/search/movie', ({ request }) => {
    const query = (new URL(request.url).searchParams.get('query') ?? '')
      .trim()
      .toLocaleLowerCase('tr')
    const results = query
      ? movies.filter((movie) => movie.title.toLocaleLowerCase('tr').includes(query))
      : []
    return HttpResponse.json({ page: 1, results, total_pages: 1, total_results: results.length })
  })
}
