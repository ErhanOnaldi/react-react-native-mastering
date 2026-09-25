import { http, HttpResponse } from 'msw'
export function makeSearchErrorHandler(status: number) {
  return http.get('https://api.themoviedb.org/3/search/movie', () =>
    HttpResponse.json({ status_message: 'Arama başarısız' }),
  )
}
