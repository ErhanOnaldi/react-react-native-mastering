import { useEffect, useState } from 'react'
export function SearchCount({ query }: { query: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!query.trim()) {
      setCount(0)
      return
    }
    const url = new URL('https://api.themoviedb.org/3/search/movie')
    url.searchParams.set('query', query)
    fetch(url, { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` } })
      .then((r) => r.json())
      .then((d: { total_results: number }) => setCount(d.total_results))
  }, [query])
  return <p>{count} sonuç</p>
}
