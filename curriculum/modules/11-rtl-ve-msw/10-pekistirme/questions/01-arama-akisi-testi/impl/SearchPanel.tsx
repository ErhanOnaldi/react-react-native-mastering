import { useState } from 'react'
type State =
  { kind: 'idle' | 'loading' } | { kind: 'success'; titles: string[] } | { kind: 'error' }
export function SearchPanel() {
  const [query, setQuery] = useState('')
  const [state, setState] = useState<State>({ kind: 'idle' })
  async function search() {
    if (!query.trim()) return
    setState({ kind: 'loading' })
    try {
      const url = new URL('https://api.themoviedb.org/3/search/movie')
      url.searchParams.set('query', query.trim())
      const response = await fetch(url, { headers: { Authorization: 'Bearer test-token' } })
      if (!response.ok) throw new Error('HTTP')
      const data = (await response.json()) as { results: { title: string }[] }
      setState({ kind: 'success', titles: data.results.map((movie) => movie.title) })
    } catch {
      setState({ kind: 'error' })
    }
  }
  return (
    <main>
      <label htmlFor="query">Film ara</label>
      <input
        id="query"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
      <button type="button" onClick={search}>
        Ara
      </button>
      {state.kind === 'loading' && <p role="status">Yükleniyor</p>}
      {state.kind === 'error' && <p role="alert">Arama başarısız</p>}
      {state.kind === 'success' &&
        (state.titles.length ? (
          state.titles.map((title) => <h2 key={title}>{title}</h2>)
        ) : (
          <p role="status">Film bulunamadı</p>
        ))}
    </main>
  )
}
