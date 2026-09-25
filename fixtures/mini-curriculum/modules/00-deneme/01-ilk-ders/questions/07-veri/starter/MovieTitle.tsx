import { useState } from 'react'

export function MovieTitle({ id }: { id: number }) {
  const [title, setTitle] = useState('')
  fetch(`https://api.themoviedb.org/3/movie/${id}`)
    .then((res) => res.json())
    .then((movie: { title: string }) => setTitle(movie.title))
  return <h1>{title || 'Yükleniyor…'}</h1>
}
