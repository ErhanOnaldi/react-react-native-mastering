// Sahte TMDB ve DummyJSON (salt okunur): testlerin tarayıcıdaki ağ katmanı.
// Modül 11'deki MSW sahte TMDB'sinin Playwright karşılığı — 5. derste bunu kendin yazacaksın.
import type { BrowserContext, Route } from '@playwright/test'

export const TMDB_BASE = 'https://api.themoviedb.org/3'
export const DUMMYJSON_BASE = 'https://dummyjson.com'
export const TEST_USER = { username: 'emilys', password: 'emilyspass' } as const

export interface FakeMovie {
  id: number
  title: string
  original_title: string
  release_date: string
  vote_average: number
  overview: string
  tagline: string
  runtime: number
  cast: { name: string; character: string }[]
}

export const movies: FakeMovie[] = [
  {
    id: 550,
    title: 'Dövüş Kulübü',
    original_title: 'Fight Club',
    release_date: '1999-10-15',
    vote_average: 8.437,
    overview:
      'Uykusuzluk çeken bir adam ile tekinsiz bir sabun satıcısı bir yeraltı dövüş kulübü kurar.',
    tagline: '',
    runtime: 139,
    cast: [
      { name: 'Edward Norton', character: 'Narrator' },
      { name: 'Brad Pitt', character: 'Tyler Durden' },
    ],
  },
  {
    id: 27205,
    title: 'Başlangıç',
    original_title: 'Inception',
    release_date: '2010-07-15',
    vote_average: 8.374,
    overview: 'Cobb, hedeflerinin bilinçaltına sızarak sır çalan yetenekli bir hırsızdır.',
    tagline: 'Aklınız suç mahallidir.',
    runtime: 148,
    cast: [
      { name: 'Leonardo DiCaprio', character: 'Dom Cobb' },
      { name: 'Joseph Gordon-Levitt', character: 'Arthur' },
    ],
  },
  {
    id: 155,
    title: 'Kara Şövalye',
    original_title: 'The Dark Knight',
    release_date: '2008-07-16',
    vote_average: 8.535,
    overview:
      'Batman, Gordon ve Harvey Dent ile Gotham sokaklarındaki suç örgütlerine karşı savaşır.',
    tagline: 'Kanunsuz bir dünyaya hoşgeldiniz.',
    runtime: 152,
    cast: [
      { name: 'Christian Bale', character: 'Bruce Wayne' },
      { name: 'Heath Ledger', character: 'Joker' },
    ],
  },
  {
    id: 157336,
    title: 'Yıldızlararası',
    original_title: 'Interstellar',
    release_date: '2014-11-05',
    vote_average: 8.488,
    overview:
      'Kuraklığın vurduğu Dünya’dan bir grup kâşif, insanlığa yeni bir yuva aramak için yola çıkar.',
    tagline: 'Zamanın ötesinde bir yolculuk.',
    runtime: 169,
    cast: [
      { name: 'Matthew McConaughey', character: 'Cooper' },
      { name: 'Anne Hathaway', character: 'Brand' },
    ],
  },
  {
    id: 603,
    title: 'Matrix',
    original_title: 'The Matrix',
    release_date: '1999-03-31',
    vote_average: 8.259,
    overview: 'Bilgisayar korsanı Neo, yaşadığı dünyanın bir simülasyon olduğunu öğrenir.',
    tagline: 'Gerçek dünyaya hoş geldin.',
    runtime: 136,
    cast: [
      { name: 'Keanu Reeves', character: 'Neo' },
      { name: 'Laurence Fishburne', character: 'Morpheus' },
    ],
  },
  {
    id: 604,
    title: 'Matrix Reloaded',
    original_title: 'The Matrix Reloaded',
    release_date: '2003-05-15',
    vote_average: 7.0,
    overview: 'Neo ve arkadaşları, Zion’a yaklaşan makine ordusuna karşı zamanla yarışır.',
    tagline: '',
    runtime: 138,
    cast: [{ name: 'Keanu Reeves', character: 'Neo' }],
  },
  {
    id: 680,
    title: 'Ucuz Roman',
    original_title: 'Pulp Fiction',
    release_date: '1994-09-10',
    vote_average: 8.48,
    overview: 'Jules ve Vincent, patronlarından çalınan bir çantayı geri almaya çalışır.',
    tagline: 'Kurguyu izleyene kadar gerçekleri bilemezsiniz.',
    runtime: 154,
    cast: [
      { name: 'John Travolta', character: 'Vincent Vega' },
      { name: 'Samuel L. Jackson', character: 'Jules Winnfield' },
    ],
  },
]

export interface FakeApiOptions {
  /** Genel TMDB gecikmesi (ms) */
  latencyMs?: number
  /** Arama gecikmesi (ms) */
  searchLatencyMs?: number
  /** Giriş gecikmesi (ms) */
  loginLatencyMs?: number
}

/** `@test-utils`'teki `requests()` günlüğünün karşılığı. */
export interface LoggedRequest {
  method: string
  path: string
  search: URLSearchParams
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function toListItem(movie: FakeMovie) {
  const { cast: _cast, tagline: _tagline, runtime: _runtime, ...item } = movie
  return item
}

function list(results: FakeMovie[]) {
  return {
    page: 1,
    results: results.map(toListItem),
    total_pages: 1,
    total_results: results.length,
  }
}

async function tmdbHandler(route: Route, log: LoggedRequest[], options: FakeApiOptions) {
  const request = route.request()
  const url = new URL(request.url())
  log.push({ method: request.method(), path: url.pathname, search: url.searchParams })
  const auth = request.headers()['authorization'] ?? ''
  if (!/^Bearer\s+\S+$/.test(auth)) {
    return route.fulfill({
      status: 401,
      json: { status_code: 7, status_message: 'Invalid API key: You must be granted a valid key.' },
    })
  }
  const path = url.pathname.replace(/^\/3/, '')
  if (path === '/trending/movie/week') {
    await wait(options.latencyMs ?? 200)
    return route.fulfill({ json: list(movies) })
  }
  if (path === '/search/movie') {
    await wait(options.searchLatencyMs ?? 400)
    const query = (url.searchParams.get('query') ?? '').toLocaleLowerCase('tr-TR')
    const found = movies.filter((m) =>
      [m.title, m.original_title].some((t) => t.toLocaleLowerCase('tr-TR').includes(query)),
    )
    return route.fulfill({ json: list(found) })
  }
  const detail = /^\/movie\/(\d+)$/.exec(path)
  const movie = detail ? movies.find((m) => m.id === Number(detail[1])) : undefined
  await wait(options.latencyMs ?? 200)
  if (movie) {
    const { cast, ...rest } = movie
    return route.fulfill({ json: { ...rest, credits: { cast, crew: [] } } })
  }
  return route.fulfill({
    status: 404,
    json: { status_code: 34, status_message: 'The resource you requested could not be found.' },
  })
}

async function dummyJsonHandler(route: Route, log: LoggedRequest[], options: FakeApiOptions) {
  const request = route.request()
  const url = new URL(request.url())
  log.push({ method: request.method(), path: url.pathname, search: url.searchParams })
  if (url.pathname === '/auth/login' && request.method() === 'POST') {
    await wait(options.loginLatencyMs ?? 500)
    const body = (request.postDataJSON() ?? {}) as { username?: string; password?: string }
    if (body.username !== TEST_USER.username || body.password !== TEST_USER.password) {
      return route.fulfill({ status: 400, json: { message: 'Invalid credentials' } })
    }
    return route.fulfill({
      json: {
        id: 1,
        username: 'emilys',
        email: 'emily.johnson@x.dummyjson.com',
        firstName: 'Emily',
        lastName: 'Johnson',
        accessToken: 'e2e-access-token',
        refreshToken: 'e2e-refresh-token',
      },
    })
  }
  return route.fulfill({ status: 404, json: { message: 'Not found' } })
}

/** Sahte TMDB ve DummyJSON'u bağlama (context) kurar; atılan istekleri döndürür. */
export async function serveFakeApi(
  context: BrowserContext,
  options: FakeApiOptions = {},
): Promise<LoggedRequest[]> {
  const log: LoggedRequest[] = []
  await context.route(`${TMDB_BASE}/**`, (route) => tmdbHandler(route, log, options))
  await context.route(`${DUMMYJSON_BASE}/**`, (route) => dummyJsonHandler(route, log, options))
  return log
}
