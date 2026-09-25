// Sahte DummyJSON (https://dummyjson.com): JWT ile giriş, /auth/me, refresh ve yorum ekleme.
// Token'lar gerçek JWT biçimindedir (header.payload.imza); payload'daki `exp` süresi dolunca 401 döner
// (fake timer'larla test edilebilir).
import { delay, http, HttpResponse } from 'msw'
import me from '../../fixtures/dummyjson/me-emilys.json'
import loginUser from '../../fixtures/dummyjson/user-emilys.json'

export const DUMMYJSON_BASE = 'https://dummyjson.com'
export const TEST_USER = { username: 'emilys', password: 'emilyspass' } as const

interface TokenPayload {
  id: number
  username: string
  email: string
  kind: 'access' | 'refresh'
  iat: number
  exp: number
}

const state = {
  counter: 0,
  refreshTokens: new Set<string>(),
  comments: 340,
}

export function resetDummyJsonState() {
  state.counter = 0
  state.refreshTokens.clear()
  state.comments = 340
}

function base64url(value: string) {
  return btoa(unescape(encodeURIComponent(value)))
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function decodePayload(token: string): TokenPayload | undefined {
  const part = token.split('.')[1]
  if (!part) return undefined
  try {
    const json = decodeURIComponent(escape(atob(part.replace(/-/g, '+').replace(/_/g, '/'))))
    return JSON.parse(json) as TokenPayload
  } catch {
    return undefined
  }
}

function sign(kind: TokenPayload['kind'], minutes: number) {
  const iat = Math.floor(Date.now() / 1000)
  const payload: TokenPayload = {
    id: loginUser.id,
    username: loginUser.username,
    email: loginUser.email,
    kind,
    iat,
    exp: iat + minutes * 60,
  }
  state.counter += 1
  return `${base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))}.${base64url(JSON.stringify(payload))}.sahte-imza-${state.counter}`
}

function issueTokens(minutes: number) {
  const accessToken = sign('access', minutes)
  const refreshToken = sign('refresh', 60 * 24 * 7)
  state.refreshTokens.add(refreshToken)
  return { accessToken, refreshToken }
}

function isValid(token: string | undefined, kind: TokenPayload['kind']) {
  if (!token) return false
  const payload = decodePayload(token)
  return Boolean(payload && payload.kind === kind && payload.exp * 1000 > Date.now())
}

const message = (text: string, status: number) => HttpResponse.json({ message: text }, { status })

export const dummyJsonHandlers = [
  http.post(`${DUMMYJSON_BASE}/auth/login`, async ({ request }) => {
    await delay()
    const body = (await request.json().catch(() => null)) as {
      username?: string
      password?: string
      expiresInMins?: number
    } | null
    if (!body?.username || !body.password) return message('Username and password required', 400)
    if (body.username !== TEST_USER.username || body.password !== TEST_USER.password) {
      return message('Invalid credentials', 400)
    }
    return HttpResponse.json({ ...issueTokens(body.expiresInMins ?? 60), ...loginUser })
  }),

  http.get(`${DUMMYJSON_BASE}/auth/me`, async ({ request }) => {
    await delay()
    const header = request.headers.get('Authorization')
    if (!header) return message('Access Token is required', 401)
    const token = header.replace(/^Bearer\s+/, '')
    if (!isValid(token, 'access')) return message('Invalid/Expired Token!', 401)
    return HttpResponse.json(me)
  }),

  http.post(`${DUMMYJSON_BASE}/auth/refresh`, async ({ request }) => {
    await delay()
    const body = (await request.json().catch(() => null)) as {
      refreshToken?: string
      expiresInMins?: number
    } | null
    const token = body?.refreshToken
    if (!token || !state.refreshTokens.has(token) || !isValid(token, 'refresh')) {
      return message('Invalid refresh token', 403)
    }
    state.refreshTokens.delete(token) // refresh token tek kullanımlık (rotation)
    return HttpResponse.json(issueTokens(body?.expiresInMins ?? 60))
  }),

  http.post(`${DUMMYJSON_BASE}/comments/add`, async ({ request }) => {
    await delay()
    const body = (await request.json().catch(() => null)) as {
      body?: string
      postId?: number
      userId?: number
    } | null
    if (!body?.body?.trim()) return message('Body is required', 400)
    state.comments += 1
    return HttpResponse.json(
      {
        id: state.comments,
        body: body.body,
        postId: body.postId ?? 1,
        user: {
          id: body.userId ?? loginUser.id,
          username: loginUser.username,
          fullName: `${loginUser.firstName} ${loginUser.lastName}`,
        },
      },
      { status: 201 },
    )
  }),
]
