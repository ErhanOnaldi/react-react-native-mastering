import { useState } from 'react'
const movies = [
  { id: 550, title: 'Dövüş Kulübü' },
  { id: 155, title: 'Kara Şövalye' },
  { id: 603, title: 'Matrix' },
]
export function MoviePicker() {
  const [reverse, setReverse] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const visible = reverse ? [...movies].reverse() : movies
  return (
    <>
      <button onClick={() => setReverse((value) => !value)}>Sırayı ters çevir</button>
      <ul>
        {visible.map((movie) => (
          <li key={movie.id}>
            <button aria-pressed={selected === movie.id} onClick={() => setSelected(movie.id)}>
              {movie.title} seç
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}
