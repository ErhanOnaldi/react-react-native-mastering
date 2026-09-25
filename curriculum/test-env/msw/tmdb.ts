// Sahte TMDB API'si: gerçek TMDB cevaplarından örneklenmiş fixture'larla, gerçek API gibi davranır.
// Hem testlerde (msw/node) hem de platformun canlı önizlemesinde (msw/browser) kullanılır.
import { delay, http, HttpResponse } from 'msw'
import configuration from '../../fixtures/tmdb/configuration.json'
import discoverAction from '../../fixtures/tmdb/discover-action-1.json'
import discoverComedy from '../../fixtures/tmdb/discover-comedy-1.json'
import genres from '../../fixtures/tmdb/genres.json'
import movie155 from '../../fixtures/tmdb/movie-155.json'
import movie157336 from '../../fixtures/tmdb/movie-157336.json'
import movie27205 from '../../fixtures/tmdb/movie-27205.json'
import movie550 from '../../fixtures/tmdb/movie-550.json'
import movie603 from '../../fixtures/tmdb/movie-603.json'
import movie680 from '../../fixtures/tmdb/movie-680.json'
import popular1 from '../../fixtures/tmdb/popular-1.json'
import popular2 from '../../fixtures/tmdb/popular-2.json'
import trendingWeek from '../../fixtures/tmdb/trending-week.json'

export const TMDB_BASE = 'https://api.themoviedb.org/3'
const PAGE_SIZE = 20

export interface TmdbListMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  genre_ids: number[]
  popularity: number
  vote_average: number
  vote_count: number
  adult: boolean
  original_language: string
  video: boolean
}

type Details = Record<string, unknown> & { id: number; genres: { id: number; name: string }[] }

const detailFixtures = new Map<number, Details>(
  [movie550, movie27205, movie155, movie157336, movie603, movie680].map((m) => [
    m.id,
    m as unknown as Details,
  ]),
)

function toListMovie(raw: Record<string, unknown>): TmdbListMovie {
  const { media_type: _mediaType, softcore: _softcore, ...rest } = raw
  return rest as unknown as TmdbListMovie
}

function unique(movies: TmdbListMovie[]) {
  const seen = new Set<number>()
  return movies.filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)))
}

const trending = trendingWeek.results.map(toListMovie)
const popular = [...popular1.results, ...popular2.results].map(toListMovie)
/** Tüm bilinen filmler (arama, keşfet ve minimal detay için). */
export const catalog: TmdbListMovie[] = unique([
  ...trending,
  ...popular,
  ...discoverAction.results.map(toListMovie),
  ...discoverComedy.results.map(toListMovie),
  ...[...detailFixtures.values()].map((d) =>
    toListMovie({ ...d, genre_ids: d.genres.map((g) => g.id) }),
  ),
])

// ---------- yardımcılar ----------

function error(status: number, statusCode: number, message: string) {
  return HttpResponse.json(
    { success: false, status_code: statusCode, status_message: message },
    { status },
  )
}

const unauthorized = () => error(401, 7, 'Invalid API key: You must be granted a valid key.')
const notFound = () => error(404, 34, 'The resource you requested could not be found.')

function isAuthorized(request: Request) {
  const header = request.headers.get('Authorization')
  if (header && /^Bearer\s+\S+/.test(header)) return true
  return new URL(request.url).searchParams.has('api_key')
}

function normalize(text: string) {
  return text
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function paginate(items: TmdbListMovie[], url: URL) {
  const page = Number(url.searchParams.get('page') ?? '1')
  if (!Number.isInteger(page) || page < 1 || page > 500) {
    return error(
      400,
      22,
      'Invalid page: Pages start at 1 and max at 500. They are expected to be an integer.',
    )
  }
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  return HttpResponse.json({
    page,
    results: items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    total_pages: totalPages,
    total_results: items.length,
  })
}

function withRest(first: TmdbListMovie[]) {
  const ids = new Set(first.map((m) => m.id))
  return [...first, ...catalog.filter((m) => !ids.has(m.id))]
}

const byPopularity = (a: TmdbListMovie, b: TmdbListMovie) => b.popularity - a.popularity

const sorters: Record<string, (a: TmdbListMovie, b: TmdbListMovie) => number> = {
  'popularity.desc': byPopularity,
  'popularity.asc': (a, b) => a.popularity - b.popularity,
  'vote_average.desc': (a, b) => b.vote_average - a.vote_average,
  'vote_average.asc': (a, b) => a.vote_average - b.vote_average,
  'primary_release_date.desc': (a, b) => b.release_date.localeCompare(a.release_date),
  'primary_release_date.asc': (a, b) => a.release_date.localeCompare(b.release_date),
  'title.asc': (a, b) => a.title.localeCompare(b.title, 'tr'),
  'title.desc': (a, b) => b.title.localeCompare(a.title, 'tr'),
}

function details(id: number, append: string[]): Details | undefined {
  const full = detailFixtures.get(id)
  if (full) {
    const { credits, videos, ...rest } = full
    return {
      ...rest,
      ...(append.includes('credits') ? { credits } : {}),
      ...(append.includes('videos') ? { videos } : {}),
    } as Details
  }
  const item = catalog.find((m) => m.id === id)
  if (!item) return undefined
  const { genre_ids, ...rest } = item
  return {
    ...rest,
    genres: genres.genres.filter((g) => genre_ids.includes(g.id)),
    runtime: null,
    tagline: '',
    status: 'Released',
    budget: 0,
    revenue: 0,
    homepage: '',
    imdb_id: null,
    ...(append.includes('credits') ? { credits: { id, cast: [], crew: [] } } : {}),
    ...(append.includes('videos') ? { videos: { id, results: [] } } : {}),
  }
}

// ---------- guest session + puanlama durumu ----------

const state = {
  sessionCounter: 0,
  sessions: new Set<string>(),
  ratings: new Map<string, Map<number, number>>(),
}

/** Testler arasında puanlama/oturum durumunu temizler. */
export function resetTmdbState() {
  state.sessionCounter = 0
  state.sessions.clear()
  state.ratings.clear()
}

function guestSession(url: URL) {
  const id = url.searchParams.get('guest_session_id')
  return id && state.sessions.has(id) ? id : undefined
}

// ---------- handler'lar ----------

export const tmdbHandlers = [
  http.all(`${TMDB_BASE}/*`, async ({ request }) => {
    await delay()
    if (!isAuthorized(request)) return unauthorized()
    return undefined // bir sonraki handler'a geç
  }),

  http.get(`${TMDB_BASE}/configuration`, () => HttpResponse.json(configuration)),
  http.get(`${TMDB_BASE}/genre/movie/list`, () => HttpResponse.json(genres)),

  http.get(`${TMDB_BASE}/trending/movie/:window`, ({ request, params }) => {
    if (params.window !== 'day' && params.window !== 'week') return notFound()
    return paginate(withRest(trending), new URL(request.url))
  }),

  http.get(`${TMDB_BASE}/movie/popular`, ({ request }) =>
    paginate(withRest(popular), new URL(request.url)),
  ),

  http.get(`${TMDB_BASE}/movie/top_rated`, ({ request }) =>
    paginate(
      catalog.filter((m) => m.vote_count > 100).sort(sorters['vote_average.desc']),
      new URL(request.url),
    ),
  ),

  http.get(`${TMDB_BASE}/discover/movie`, ({ request }) => {
    const url = new URL(request.url)
    const genreParam = url.searchParams.get('with_genres')
    const wanted = genreParam ? genreParam.split(',').map(Number) : []
    const sortBy = url.searchParams.get('sort_by') ?? 'popularity.desc'
    const sorter = sorters[sortBy] ?? byPopularity
    const items = catalog.filter((m) => wanted.every((g) => m.genre_ids.includes(g))).sort(sorter)
    return paginate(items, url)
  }),

  http.get(`${TMDB_BASE}/search/movie`, ({ request }) => {
    const url = new URL(request.url)
    const query = normalize(url.searchParams.get('query')?.trim() ?? '')
    const items = query
      ? catalog.filter(
          (m) => normalize(m.title).includes(query) || normalize(m.original_title).includes(query),
        )
      : []
    return paginate(items.sort(byPopularity), url)
  }),

  http.get(`${TMDB_BASE}/movie/:id`, ({ request, params }) => {
    const id = Number(params.id)
    if (!Number.isInteger(id)) return notFound()
    const append = (new URL(request.url).searchParams.get('append_to_response') ?? '').split(',')
    const movie = details(id, append)
    return movie ? HttpResponse.json(movie) : notFound()
  }),

  http.get(`${TMDB_BASE}/movie/:id/credits`, ({ params }) => {
    const movie = details(Number(params.id), ['credits'])
    return movie ? HttpResponse.json(movie.credits as Record<string, unknown>) : notFound()
  }),

  http.get(`${TMDB_BASE}/movie/:id/videos`, ({ params }) => {
    const movie = details(Number(params.id), ['videos'])
    return movie ? HttpResponse.json(movie.videos as Record<string, unknown>) : notFound()
  }),

  http.get(`${TMDB_BASE}/movie/:id/similar`, ({ request, params }) => {
    const id = Number(params.id)
    const movie = catalog.find((m) => m.id === id)
    if (!movie) return notFound()
    const similar = catalog.filter(
      (m) => m.id !== id && m.genre_ids.some((g) => movie.genre_ids.includes(g)),
    )
    return paginate(similar.sort(byPopularity), new URL(request.url))
  }),

  http.get(`${TMDB_BASE}/authentication/guest_session/new`, () => {
    const id = `guest-${++state.sessionCounter}`
    state.sessions.add(id)
    return HttpResponse.json({
      success: true,
      guest_session_id: id,
      expires_at:
        new Date(Date.now() + 24 * 3600_000).toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    })
  }),

  http.post(`${TMDB_BASE}/movie/:id/rating`, async ({ request, params }) => {
    const session = guestSession(new URL(request.url))
    if (!session)
      return error(
        401,
        3,
        'Authentication failed: You do not have permissions to access the service.',
      )
    const id = Number(params.id)
    if (!catalog.some((m) => m.id === id)) return notFound()
    const body = (await request.json().catch(() => null)) as { value?: unknown } | null
    const value = body?.value
    if (typeof value !== 'number' || value < 0.5 || value > 10 || (value * 2) % 1 !== 0) {
      return error(400, 18, 'Value too low: Value must be greater than 0.0.')
    }
    const ratings = state.ratings.get(session) ?? new Map<number, number>()
    const existed = ratings.has(id)
    ratings.set(id, value)
    state.ratings.set(session, ratings)
    return existed
      ? HttpResponse.json(
          {
            success: true,
            status_code: 12,
            status_message: 'The item/record was updated successfully.',
          },
          { status: 201 },
        )
      : HttpResponse.json(
          { success: true, status_code: 1, status_message: 'Success.' },
          { status: 201 },
        )
  }),

  http.delete(`${TMDB_BASE}/movie/:id/rating`, ({ request, params }) => {
    const session = guestSession(new URL(request.url))
    if (!session)
      return error(
        401,
        3,
        'Authentication failed: You do not have permissions to access the service.',
      )
    state.ratings.get(session)?.delete(Number(params.id))
    return HttpResponse.json({
      success: true,
      status_code: 13,
      status_message: 'The item/record was deleted successfully.',
    })
  }),

  http.get(`${TMDB_BASE}/guest_session/:sessionId/rated/movies`, ({ request, params }) => {
    const sessionId = String(params.sessionId)
    if (!state.sessions.has(sessionId))
      return error(
        401,
        3,
        'Authentication failed: You do not have permissions to access the service.',
      )
    const ratings = state.ratings.get(sessionId) ?? new Map<number, number>()
    const items = catalog
      .filter((m) => ratings.has(m.id))
      .map((m) => ({ ...m, rating: ratings.get(m.id) }))
    return paginate(items, new URL(request.url))
  }),
]
