export interface Tokens {
  accessToken: string
  refreshToken: string
}
export async function login(username: string, password: string): Promise<Tokens> {
  return { accessToken: '', refreshToken: '' }
}
