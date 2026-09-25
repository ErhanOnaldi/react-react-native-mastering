import { http, HttpResponse } from 'msw'
export const filmHandler = http.get('https://api.themoviedb.org/3/movie/:id', () =>
  HttpResponse.json({ status_code: 34 }, { status: 404 }),
)
