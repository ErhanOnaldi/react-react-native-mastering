import { http, HttpResponse } from 'msw'
export const filmHandler = http.get(
  'https://api.themoviedb.org/3/movie/:id',
  ({ request, params }) => {
    const authorization = request.headers.get('Authorization')
    if (!authorization || !/^Bearer\s+\S+$/.test(authorization))
      return HttpResponse.json({ status_code: 7 }, { status: 401 })
    if (params.id === '550') return HttpResponse.json({ id: 550, title: 'Dövüş Kulübü' })
    return HttpResponse.json({ status_code: 34 }, { status: 404 })
  },
)
