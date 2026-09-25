import { useState } from 'react'
export function SearchPage() {
  const [query, setQuery] = useState('')
  return (
    <section>
      <label>
        Film ara
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
    </section>
  )
}
