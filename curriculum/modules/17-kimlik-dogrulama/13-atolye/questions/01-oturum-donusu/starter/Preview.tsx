import { useState } from 'react'
import { ProfileGate } from './ProfileGate'

export default function Preview() {
  const [key, setKey] = useState(0)
  const [token, setToken] = useState<string | null>(null)

  async function fetchRealToken() {
    const response = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'emilys', password: 'emilyspass' }),
    })
    const data = (await response.json()) as { accessToken: string }
    setToken(data.accessToken)
  }

  return (
    <div>
      <p>
        Önce normal formdan giriş yap. Sonra "Jeton oturumunu simüle et" ile jetonu al ve "Sayfayı
        yenile"ye bas: profilin hemen görünmesi gerekir.
      </p>
      <button onClick={() => void fetchRealToken()}>Jeton oturumunu simüle et</button>
      <button onClick={() => setKey((value) => value + 1)}>Sayfayı yenile</button>
      <ProfileGate key={key} initialToken={token} />
    </div>
  )
}
