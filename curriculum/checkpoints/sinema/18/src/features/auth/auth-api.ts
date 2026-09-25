import type { Credentials } from './authSlice'

export async function login(
  username: string,
  password: string,
): Promise<
  Credentials['user'] & Pick<Credentials, 'accessToken' | 'refreshToken'>
> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    const error: unknown = await response.json()
    const message =
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string'
        ? error.message
        : 'Giriş başarısız.'
    throw new Error(message)
  }
  return response.json()
}
