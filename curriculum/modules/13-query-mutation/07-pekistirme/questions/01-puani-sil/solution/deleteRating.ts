export async function deleteRating(movieId: number, sessionId: string): Promise<void> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/rating?guest_session_id=${encodeURIComponent(sessionId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    },
  )
  if (!response.ok) throw new Error(`Puan silinemedi: ${response.status}`)
}
