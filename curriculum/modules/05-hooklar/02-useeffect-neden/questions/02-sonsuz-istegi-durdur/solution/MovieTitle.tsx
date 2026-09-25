import { useEffect, useState } from 'react'
export function MovieTitle({ id }: { id: number }) {
  const [movie, setMovie] = useState<{ title: string } | null>(null)
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((r) => r.json())
      .then((data: { title: string }) => setMovie(data))
  }, [])
  return <h1>{movie?.title ?? 'Yükleniyor…'}</h1>
}
