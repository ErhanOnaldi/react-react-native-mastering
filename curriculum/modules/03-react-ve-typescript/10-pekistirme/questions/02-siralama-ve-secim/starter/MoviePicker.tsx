import { useState } from 'react'
const movies = [
  { id: 550, title: 'Dövüş Kulübü' },
  { id: 155, title: 'Kara Şövalye' },
  { id: 603, title: 'Matrix' },
]
export function MoviePicker() {
  const [reverse, setReverse] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <>
      <button onClick={() => setReverse((value) => !value)}>Sırayı ters çevir</button>
      <ul>
        {movies.map((movie, index) => (
          <li key={index}>
            <button aria-pressed={false}>{movie.title} seç</button>
          </li>
        ))}
      </ul>
    </>
  )
}
