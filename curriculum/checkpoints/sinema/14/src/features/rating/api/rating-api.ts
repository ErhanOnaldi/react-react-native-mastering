import { tmdbClient } from '@/shared/api/tmdb-client'

const SESSION_KEY = 'guest_session_id'

export async function getGuestSession(): Promise<string> {
  const stored = localStorage.getItem(SESSION_KEY)
  if (stored) return stored

  const session = await tmdbClient.get<{ guest_session_id: string }>(
    '/authentication/guest_session/new',
  )
  localStorage.setItem(SESSION_KEY, session.guest_session_id)
  return session.guest_session_id
}

export async function rateMovie({
  movieId,
  value,
}: {
  movieId: number
  value: number
}): Promise<void> {
  if (!Number.isInteger(movieId) || movieId <= 0)
    throw new Error('Geçersiz film.')
  if (value < 0.5 || value > 10 || !Number.isInteger(value * 2)) {
    throw new Error('Puan 0,5 ile 10 arasında ve 0,5 aralıklarla olmalı.')
  }
  const sessionId = await getGuestSession()
  await tmdbClient.post(
    `/movie/${movieId}/rating`,
    { value },
    { guest_session_id: sessionId },
  )
}

export async function deleteRating(movieId: number): Promise<void> {
  if (!Number.isInteger(movieId) || movieId <= 0)
    throw new Error('Geçersiz film.')
  const sessionId = await getGuestSession()
  await tmdbClient.delete(`/movie/${movieId}/rating`, {
    guest_session_id: sessionId,
  })
}
