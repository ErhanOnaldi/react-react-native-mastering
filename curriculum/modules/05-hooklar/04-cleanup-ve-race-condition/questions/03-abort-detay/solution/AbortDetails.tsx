import { useEffect, useState } from 'react'
export function AbortDetails({ id }: { id: number }) {
  const [title, setTitle] = useState('Yükleniyor')
  useEffect(() => {
    const controller = new AbortController()
    fetch(`https://api.themoviedb.org/3/movie/${id}`, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((r) => r.json())
      .then((d: { title: string }) => setTitle(d.title))
      .catch((e) => {
        if ((e as Error).name !== 'AbortError') setTitle('Hata')
      })
    return () => controller.abort()
  }, [id])
  return <p>{title}</p>
}
