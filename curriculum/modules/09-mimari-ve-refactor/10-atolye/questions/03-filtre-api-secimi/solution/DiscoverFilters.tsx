import { useState } from 'react'

type Filters = { genre: string; sort: string }
const defaults: Filters = { genre: '28', sort: 'popularity.desc' }
// Tek filters değeri seçtim: iki kontrolün birlikte sıfırlanması ve dışarı taşınması kolay.
export function DiscoverFilters() {
  const [filters, setFilters] = useState<Filters>(defaults)
  return (
    <section>
      <label>
        Tür{' '}
        <select
          value={filters.genre}
          onChange={(event) => setFilters({ ...filters, genre: event.target.value })}
        >
          <option value="28">Aksiyon</option>
          <option value="35">Komedi</option>
        </select>
      </label>
      <label>
        Sıralama{' '}
        <select
          value={filters.sort}
          onChange={(event) => setFilters({ ...filters, sort: event.target.value })}
        >
          <option value="popularity.desc">Popüler</option>
          <option value="title.asc">Başlık</option>
        </select>
      </label>
      <button onClick={() => setFilters(defaults)}>Sıfırla</button>
      <p>Tür: {filters.genre === '28' ? 'Aksiyon' : 'Komedi'}</p>
      <p>Sıralama: {filters.sort === 'popularity.desc' ? 'Popüler' : 'Başlık'}</p>
    </section>
  )
}
