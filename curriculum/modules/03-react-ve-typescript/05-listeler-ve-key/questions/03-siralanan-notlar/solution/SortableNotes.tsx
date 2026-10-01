import { useState } from 'react'
const movies = [
  { id: 550, title: 'Dövüş Kulübü' },
  { id: 603, title: 'Matrix' },
]
export function SortableNotes() {
  const [reverse, setReverse] = useState(false)
  const visible = reverse ? [...movies].reverse() : movies
  return (
    <>
      <button onClick={() => setReverse((value) => !value)}>Sırayı ters çevir</button>
      <ul>
        {visible.map((movie) => (
          <li key={movie.id}>
            <label>
              {movie.title} notu <input />
            </label>
          </li>
        ))}
      </ul>
    </>
  )
}
