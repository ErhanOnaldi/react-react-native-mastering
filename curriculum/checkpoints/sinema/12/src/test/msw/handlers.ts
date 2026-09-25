import { http, HttpResponse } from 'msw'
import { TMDB_BASE_URL } from '@/shared/api/tmdb-client'

const fightClub = {
  id: 550,
  title: 'Dövüş Kulübü',
  original_title: 'Fight Club',
  overview: 'Bir adam gizli bir dövüş kulübü kurar.',
  poster_path: null,
  backdrop_path: null,
  release_date: '1999-10-15',
  genre_ids: [18],
  vote_average: 8.4,
  vote_count: 30000,
  popularity: 100,
  adult: false,
  original_language: 'en',
  video: false,
}

const matrix = {
  ...fightClub,
  id: 603,
  title: 'Matrix',
  original_title: 'The Matrix',
  overview: 'Neo gerçekliği sorgular.',
  release_date: '1999-03-31',
}

function authorized(request: Request) {
  return /^Bearer\s+\S+$/.test(request.headers.get('Authorization') ?? '')
}

function unauthorized() {
  return HttpResponse.json(
    { status_code: 7, status_message: 'Geçersiz API anahtarı.' },
    { status: 401 },
  )
}

export const handlers = [
  http.get(`${TMDB_BASE_URL}/search/movie`, ({ request }) => {
    if (!authorized(request)) return unauthorized()
    const url = new URL(request.url)
    const query = (url.searchParams.get('query') ?? '').toLocaleLowerCase('tr-TR')
    const results = [fightClub, matrix].filter((movie) =>
      [movie.title, movie.original_title].some((title) =>
        title.toLocaleLowerCase('tr-TR').includes(query),
      ),
    )
    return HttpResponse.json({ page: 1, results, total_pages: 1, total_results: results.length })
  }),
  http.get(`${TMDB_BASE_URL}/movie/:id`, ({ request, params }) => {
    if (!authorized(request)) return unauthorized()
    const movie = [fightClub, matrix].find((item) => item.id === Number(params.id))
    if (!movie) {
      return HttpResponse.json(
        { status_code: 34, status_message: 'Film bulunamadı.' },
        { status: 404 },
      )
    }
    return HttpResponse.json({
      ...movie,
      runtime: 139,
      genres: [{ id: 18, name: 'Dram' }],
      tagline: '',
      status: 'Released',
      budget: 0,
      revenue: 0,
      credits: { cast: [], crew: [] },
      videos: { results: [] },
    })
  }),
]
