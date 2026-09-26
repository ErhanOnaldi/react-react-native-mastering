import { useState } from 'react'
import { genres } from './genres'

export function GenreCounter() {
  const [selected, setSelected] = useState<number[]>([])
  const [count, setCount] = useState(0)

  function toggle(id: number) {
    setSelected((ids) => (ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id]))
    setCount(count + 1)
  }

  return (
    <section>
      {genres.map((genre) => (
        <label key={genre.id}>
          <input
            type="checkbox"
            checked={selected.includes(genre.id)}
            onChange={() => toggle(genre.id)}
          />
          {genre.name}
        </label>
      ))}
      <p>Seçili tür: {count}</p>
      <button onClick={() => setSelected([])}>Temizle</button>
    </section>
  )
}
