import { useEffect, useState } from 'react'
export function PopularTitles() {
  const [titles, setTitles] = useState<string[]>([])
  useEffect(() => {
    fetch('https://api.themoviedb.org/3/movie/popular', {
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((r) => r.json())
      .then((data: { results: { title: string }[] }) => setTitles(data.results.map((m) => m.title)))
  }, [])
  return <p>{titles.length ? titles[0] : 'Yükleniyor'}</p>
}
