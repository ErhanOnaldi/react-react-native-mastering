import { useDeferredValue, useState } from 'react'
export function DeferredSearch({ titles }: { titles: string[] }) {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const visible = titles.filter((title) =>
    title.toLocaleLowerCase('tr').includes(deferredQuery.toLocaleLowerCase('tr')),
  )
  return (
    <section>
      <label>
        Film ara <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      {query !== deferredQuery && <p>Liste güncelleniyor</p>}
      <ul>
        {visible.map((title) => (
          <li key={title}>{title}</li>
        ))}
      </ul>
    </section>
  )
}
