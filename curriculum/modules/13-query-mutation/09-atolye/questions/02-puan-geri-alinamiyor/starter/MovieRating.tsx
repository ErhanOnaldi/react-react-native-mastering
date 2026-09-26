import { useEffect, useState } from 'react'

export function MovieRating() {
  const [session, setSession] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [rated, setRated] = useState<{ id: number; rating: number }[]>([])
  useEffect(() => {
    fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((response) => response.json() as Promise<{ guest_session_id: string }>)
      .then((data) => {
        setSession(data.guest_session_id)
        return fetch(
          `https://api.themoviedb.org/3/guest_session/${data.guest_session_id}/rated/movies`,
          { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` } },
        )
      })
      .then((response) => response.json() as Promise<{ results: { id: number; rating: number }[] }>)
      .then((data) => setRated(data.results))
  }, [])
  async function rate(value: number) {
    setRating(value)
    await fetch(`https://api.themoviedb.org/3/movie/550/rating?guest_session_id=${session}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    })
  }
  return (
    <section>
      <p>Puan: {rating ?? 'yok'}</p>
      <button disabled={!session} onClick={() => void rate(7)}>
        7 puan ver
      </button>
      <button disabled={!session} onClick={() => void rate(8.5)}>
        8,5 puan ver
      </button>
      <h2>Puanladıklarım</h2>
      <ul>
        {rated.map((movie) => (
          <li key={movie.id}>{movie.rating} puan</li>
        ))}
      </ul>
    </section>
  )
}
