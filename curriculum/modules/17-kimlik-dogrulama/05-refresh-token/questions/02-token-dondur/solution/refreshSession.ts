export interface Tokens {
  accessToken: string
  refreshToken: string
}
export interface TokenStorage {
  getTokens(): Tokens | null
  setTokens(tokens: Tokens): void
}
export async function refreshSession(storage: TokenStorage): Promise<Tokens> {
  const old = storage.getTokens()
  if (!old) throw new Error('Oturum bulunamadı')
  const response = await fetch('https://dummyjson.com/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: old.refreshToken }),
  })
  if (!response.ok) throw new Error(`Refresh başarısız: ${response.status}`)
  const fresh = (await response.json()) as Tokens
  storage.setTokens(fresh)
  return fresh
}
