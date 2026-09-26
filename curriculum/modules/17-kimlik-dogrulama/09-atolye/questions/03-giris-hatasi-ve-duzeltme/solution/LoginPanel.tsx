import { useState } from 'react'

interface LoginResponse {
  username: string
}

async function requestLogin(username: string, password: string): Promise<LoginResponse> {
  const response = await fetch('https://dummyjson.com/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(body?.message ?? 'Giriş başarısız')
  }
  return (await response.json()) as LoginResponse
}

export function LoginPanel() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loggedInAs, setLoggedInAs] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError(null)
    try {
      const data = await requestLogin(username, password)
      setLoggedInAs(data.username)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Giriş başarısız')
    } finally {
      setPending(false)
    }
  }

  if (loggedInAs) {
    return <p>Hoş geldin, {loggedInAs}</p>
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
      <button type="submit" disabled={pending}>
        Giriş yap
      </button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}
