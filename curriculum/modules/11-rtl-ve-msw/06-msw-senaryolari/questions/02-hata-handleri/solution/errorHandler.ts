import { http, HttpResponse } from 'msw'
export function makeSearchErrorHandler(status: number) {
  if (!Number.isInteger(status) || status < 400 || status > 599)
    throw new RangeError('HTTP hata status’u gerekli')
  return http.get('https://api.themoviedb.org/3/search/movie', () =>
    HttpResponse.json({ status_message: 'Arama başarısız' }, { status }),
  )
}
