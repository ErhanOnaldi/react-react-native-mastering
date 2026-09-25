export interface Tokens {
  accessToken: string
  refreshToken: string
}
export interface JwtPayload {
  username: string
  exp: number
}

export async function login(username: string, password: string): Promise<Tokens> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    const error = (await response.json()) as { message?: string }
    throw new Error(error.message ?? 'Giriş başarısız')
  }
  const data = (await response.json()) as Tokens
  return { accessToken: data.accessToken, refreshToken: data.refreshToken }
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/')
    const json = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
    const data: unknown = JSON.parse(json)
    if (typeof data !== 'object' || data === null) return null
    const record = data as Record<string, unknown>
    if (typeof record.username !== 'string' || typeof record.exp !== 'number') return null
    return { username: record.username, exp: record.exp }
  } catch {
    return null
  }
}
