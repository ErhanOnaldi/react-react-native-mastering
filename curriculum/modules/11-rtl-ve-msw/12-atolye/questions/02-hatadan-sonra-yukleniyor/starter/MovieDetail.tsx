import { useEffect, useState } from 'react'

export function MovieDetail({ id }: { id: number }) {
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    setLoading(true)
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Detay yüklenemedi')
        return response.json() as Promise<{ title: string }>
      })
      .then((movie) => {
        setTitle(movie.title)
        setLoading(false)
      })
      .catch(() => setError('Detay yüklenemedi'))
  }, [id])
  return (
    <section>
      {loading && <p>Yükleniyor</p>}
      {error && <p role="alert">{error}</p>}
      {title && <h2>{title}</h2>}
    </section>
  )
}
