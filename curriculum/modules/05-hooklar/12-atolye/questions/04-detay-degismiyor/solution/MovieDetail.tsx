import { useEffect, useState } from 'react'

type Detail = { id: number; title: string }

export function MovieDetail({ id }: { id: number }) {
  const [movie, setMovie] = useState<Detail | null>(null)

  useEffect(() => {
    let active = true
    setMovie(null)
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((response) => response.json() as Promise<Detail>)
      .then((detail) => {
        if (active) setMovie(detail)
      })
    return () => {
      active = false
    }
  }, [id])

  return <section>{movie ? <h2>{movie.title}</h2> : <p>Yükleniyor</p>}</section>
}
