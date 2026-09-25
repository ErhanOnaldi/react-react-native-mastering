export interface Tokens {
  accessToken: string
  refreshToken: string
}
export interface TokenStorage {
  getTokens(): Tokens | null
  setTokens(tokens: Tokens): void
}
export async function refreshSession(storage: TokenStorage): Promise<Tokens> {
  return { accessToken: '', refreshToken: '' }
}
