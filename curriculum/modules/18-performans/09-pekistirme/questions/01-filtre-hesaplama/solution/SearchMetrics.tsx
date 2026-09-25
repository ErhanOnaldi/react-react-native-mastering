import { useDeferredValue, useMemo, useState } from 'react'
export function SearchMetrics({
  titles,
  filter,
}: {
  titles: string[]
  filter: (titles: string[], query: string) => string[]
}) {
  const [query, setQuery] = useState('')
  const [count, setCount] = useState(0)
  const deferred = useDeferredValue(query)
  const visible = useMemo(() => filter(titles, deferred), [titles, deferred, filter])
  return (
    <section>
      <label>
        Film ara <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <button onClick={() => setCount((n) => n + 1)}>Sayaç {count}</button>
      <ul>
        {visible.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
    </section>
  )
}
