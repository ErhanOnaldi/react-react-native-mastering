import { useEffect, useState } from 'react'

export function MovieTitle({ id }: { id: number }) {
  const [title, setTitle] = useState('')
  const headers = { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` }
  useEffect(() => {
    const controller = new AbortController()
    fetch(`https://api.themoviedb.org/3/movie/${id}`, { headers, signal: controller.signal })
      .then((res) => res.json())
      .then((movie: { title: string }) => setTitle(movie.title))
      .catch(() => {})
    return () => controller.abort()
  }, [id])
  return <h1>{title || 'Yükleniyor…'}</h1>
}
