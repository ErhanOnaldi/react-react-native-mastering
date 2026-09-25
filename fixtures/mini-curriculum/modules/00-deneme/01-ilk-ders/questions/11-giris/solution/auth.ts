const BASE = 'https://dummyjson.com'

export async function login(username: string, password: string): Promise<string> {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins: 1 }),
  })
  if (!res.ok) throw new Error('Giriş başarısız')
  const data = (await res.json()) as { accessToken: string }
  return data.accessToken
}

export async function getMe(accessToken: string): Promise<{ username: string } | null> {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (res.status === 401) return null
  return (await res.json()) as { username: string }
}
