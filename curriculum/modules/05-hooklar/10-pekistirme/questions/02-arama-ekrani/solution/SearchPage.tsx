import { useEffect, useState } from 'react'
export function SearchPage() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState(query)
  const [titles, setTitles] = useState<string[]>([])
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), 30)
    return () => clearTimeout(timer)
  }, [query])
  useEffect(() => {
    if (!query.trim()) {
      setTitles([])
      return
    }
    if (debounced !== query) return
    const controller = new AbortController()
    const url = new URL('https://api.themoviedb.org/3/search/movie')
    url.searchParams.set('query', debounced)
    fetch(url, {
      signal: controller.signal,
      headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}` },
    })
      .then((r) => r.json())
      .then((d: { results: { title: string }[] }) => setTitles(d.results.map((m) => m.title)))
      .catch((e) => {
        if ((e as Error).name !== 'AbortError') setTitles([])
      })
    return () => controller.abort()
  }, [debounced, query])
  return (
    <section>
      <label>
        Film ara
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <ul>
        {titles.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  )
}
