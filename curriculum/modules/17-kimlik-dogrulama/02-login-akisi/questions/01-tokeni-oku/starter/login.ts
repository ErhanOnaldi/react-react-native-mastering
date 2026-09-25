export interface Tokens {
  accessToken: string
  refreshToken: string
}
export interface JwtPayload {
  username: string
  exp: number
}

export async function login(username: string, password: string): Promise<Tokens> {
  return { accessToken: '', refreshToken: '' }
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  return null
}
