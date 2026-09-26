import { useState } from 'react'
import { MovieDetail } from './MovieDetail'
export default function Preview() {
  const [id, setId] = useState(550)
  return (
    <>
      <button onClick={() => setId(id === 550 ? 27205 : 550)}>Filmi değiştir</button>
      <MovieDetail id={id} />
    </>
  )
}
