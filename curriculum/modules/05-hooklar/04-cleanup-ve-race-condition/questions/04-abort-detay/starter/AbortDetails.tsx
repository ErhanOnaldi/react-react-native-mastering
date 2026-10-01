import { useEffect, useState } from 'react'
export function AbortDetails({ id }: { id: number }) {
  const [title, setTitle] = useState('Yükleniyor')
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((r) => r.json())
      .then((d: { title: string }) => setTitle(d.title))
  }, [id])
  return <p>{title}</p>
}
