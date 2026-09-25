const BASE = 'https://api.themoviedb.org/3'
const headers = { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` }
export async function getGuestSession(): Promise<string> {
  const stored = localStorage.getItem('guest_session_id')
  if (stored) return stored
  const response = await fetch(`${BASE}/authentication/guest_session/new`, { headers })
  if (!response.ok) throw new Error(`Oturum açılamadı: ${response.status}`)
  const body = (await response.json()) as { guest_session_id: string }
  localStorage.setItem('guest_session_id', body.guest_session_id)
  return body.guest_session_id
}
export async function rateMovie({
  movieId,
  value,
}: {
  movieId: number
  value: number
}): Promise<void> {
  if (value < 0.5 || value > 10 || (value * 2) % 1 !== 0) throw new Error('Puan 0,5 adımlı olmalı')
  const session = await getGuestSession()
  const response = await fetch(
    `${BASE}/movie/${movieId}/rating?guest_session_id=${encodeURIComponent(session)}`,
    {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ value }),
    },
  )
  if (!response.ok) throw new Error(`Puan kaydedilemedi: ${response.status}`)
}
