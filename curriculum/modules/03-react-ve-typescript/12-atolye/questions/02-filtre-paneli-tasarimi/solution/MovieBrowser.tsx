import { useState } from 'react'
import type { ReactNode } from 'react'
import { movies } from './movies'

type SearchFieldProps = {
  value: string
  onChange: (value: string) => void
}

// Kompozisyon parçalarını seçtim: başka ekranlar panele farklı kontroller
// yerleştirebilir. Tek mode prop'u az sayıda sabit görünüm için daha kısa olur.
function FilterPanel({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}

function SearchField({ value, onChange }: SearchFieldProps) {
  return (
    <label>
      Film ara
      <input value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </label>
  )
}

export function MovieBrowser() {
  const [query, setQuery] = useState('')
  const normalized = query.trim().toLocaleLowerCase('tr')
  const visible = movies.filter((movie) => movie.title.toLocaleLowerCase('tr').includes(normalized))

  return (
    <section>
      <FilterPanel>
        <SearchField value={query} onChange={setQuery} />
      </FilterPanel>
      <ul>
        {visible.map((movie) => (
          <li key={movie.id}>{movie.title}</li>
        ))}
      </ul>
    </section>
  )
}
