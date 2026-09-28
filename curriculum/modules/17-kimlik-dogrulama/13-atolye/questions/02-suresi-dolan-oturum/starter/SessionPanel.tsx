import { useState } from 'react'

interface Profile {
  id: number
  username: string
}

interface Tokens {
  accessToken: string
  refreshToken: string
}

export interface SessionPanelProps {
  /** DummyJSON login isteğindeki `expiresInMins`. Testlerde kısa tutulur. */
  sessionMinutes?: number
}

async function login(username: string, password: string, expiresInMins: number): Promise<Tokens> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, expiresInMins }),
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? 'Giriş başarısız')
  }
  return (await response.json()) as Tokens
}

async function fetchMe(accessToken: string): Promise<Profile> {
  const response = await fetch('https://dummyjson.com/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!response.ok) throw new Error('Profil alınamadı')
  return (await response.json()) as Profile
}

export function SessionPanel({ sessionMinutes = 60 }: SessionPanelProps) {
  const [session, setSession] = useState<Tokens | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [status, setStatus] = useState<'signed-out' | 'loading' | 'ready' | 'error'>('signed-out')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function loadProfile(tokens: Tokens) {
    setStatus('loading')
    try {
      const user = await fetchMe(tokens.accessToken)
      setProfile(user)
      setStatus('ready')
    } catch {
      // TODO: jetonun süresi dolmuş olabilir. Burada bir kurtarma yolu yok.
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    try {
      const tokens = await login(username, password, sessionMinutes)
      setSession(tokens)
      await loadProfile(tokens)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız')
    }
  }

  function handleRefreshClick() {
    if (session) void loadProfile(session)
  }

  return (
    <div>
      {error && <p role="alert">{error}</p>}
      {session ? (
        <section>
          {status === 'loading' && <p>Yükleniyor</p>}
          {status === 'ready' && profile && <p>Merhaba, {profile.username}</p>}
          <button onClick={handleRefreshClick}>Profili yenile</button>
        </section>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Kullanıcı adı
            <input value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
          <label>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <button type="submit">Giriş yap</button>
        </form>
      )}
    </div>
  )
}
