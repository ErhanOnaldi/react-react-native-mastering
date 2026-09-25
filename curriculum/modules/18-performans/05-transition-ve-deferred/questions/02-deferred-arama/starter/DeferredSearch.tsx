import { useState } from 'react'
export function DeferredSearch({ titles }: { titles: string[] }) {
  const [query, setQuery] = useState('')
  return (
    <section>
      <label>
        Film ara <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <ul>
        {titles.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
    </section>
  )
}
