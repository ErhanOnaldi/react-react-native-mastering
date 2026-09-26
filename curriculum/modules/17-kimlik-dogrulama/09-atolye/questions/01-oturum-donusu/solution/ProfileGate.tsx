import { useEffect, useState } from 'react'

interface Profile {
  id: number
  username: string
}

export interface ProfileGateProps {
  /** Tarayıcıda zaten kayıtlı bir oturum varsa (örn. sayfa yenilemesi) elde bulunan jeton. */
  initialToken?: string | null
}

async function login(username: string, password: string): Promise<{ accessToken: string }> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? 'Giriş başarısız')
  }
  return (await response.json()) as { accessToken: string }
}

async function fetchMe(token: string): Promise<Profile> {
  const response = await fetch('https://dummyjson.com/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Profil alınamadı')
  return (await response.json()) as Profile
}

export function ProfileGate({ initialToken = null }: ProfileGateProps) {
  const [token, setToken] = useState<string | null>(initialToken)
  const [status, setStatus] = useState<'signed-out' | 'loading' | 'ready' | 'error'>('signed-out')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!token) return
    let ignore = false
    setStatus('loading')
    fetchMe(token)
      .then((user) => {
        if (ignore) return
        setProfile(user)
        setStatus('ready')
      })
      .catch(() => {
        if (!ignore) setStatus('error')
      })
    return () => {
      ignore = true
    }
  }, [token])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError(null)
    try {
      const tokens = await login(username, password)
      setToken(tokens.accessToken)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Giriş başarısız')
    }
  }

  if (status === 'ready' && profile) {
    return (
      <section>
        <p>Merhaba, {profile.username}</p>
      </section>
    )
  }

  if (status === 'loading') {
    return <p>Yükleniyor</p>
  }

  return (
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
      {formError && <p role="alert">{formError}</p>}
      {status === 'error' && <p role="alert">Profil alınamadı</p>}
    </form>
  )
}
