import { useState } from 'react'
import type { FormEvent } from 'react'
export function SearchForm({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const clean = query.trim()
    if (clean) onSearch(clean)
  }
  return (
    <form onSubmit={submit}>
      <label>
        Film ara
        <input value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
      </label>
      <button type="submit">Ara</button>
    </form>
  )
}
