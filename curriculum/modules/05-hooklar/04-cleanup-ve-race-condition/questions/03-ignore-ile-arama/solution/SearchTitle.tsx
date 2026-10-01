import { useEffect, useState } from 'react'
export function SearchTitle({ query }: { query: string }) {
  const [title, setTitle] = useState('Yükleniyor')
  useEffect(() => {
    let ignore = false
    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`, {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((r) => r.json())
      .then((d: { results: { title: string }[] }) => {
        if (!ignore) setTitle(d.results[0]?.title ?? 'Sonuç yok')
      })
    return () => {
      ignore = true
    }
  }, [query])
  return <p>{title}</p>
}
